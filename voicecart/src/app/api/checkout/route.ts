import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

/**
 * Server-side atomic checkout endpoint.
 * Handles: validate cart → lock → create order → create splits → delete items → reset cart
 * This ensures nothing is lost even if the client crashes mid-payment.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, userId, paymentMethod, deliverySlot, splitMode } = body;

    if (!cartId || !userId || !paymentMethod || !deliverySlot) {
      return NextResponse.json({ error: 'cartId, userId, paymentMethod, and deliverySlot are required' }, { status: 400 });
    }

    const client = getDynamoClient();

    // ====== STEP 1: Get cart and validate ======
    const cartResult = await client.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: Keys.cart(cartId),
    }));

    if (!cartResult.Item) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart = cartResult.Item;

    // Check if already checked out
    if (cart.checkedOut) {
      return NextResponse.json({
        error: 'This cart has already been checked out',
        alreadyCheckedOut: true,
        checkedOutBy: cart.checkedOutBy,
      }, { status: 409 });
    }

    // ====== STEP 2: Lock the cart (mark as checkedOut) ======
    try {
      await client.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: Keys.cart(cartId),
        UpdateExpression: 'SET checkedOut = :co, checkedOutBy = :by, checkedOutAt = :at',
        ConditionExpression: 'attribute_not_exists(checkedOut) OR checkedOut = :false',
        ExpressionAttributeValues: {
          ':co': true,
          ':by': userId,
          ':at': new Date().toISOString(),
          ':false': false,
        },
      }));
    } catch (condErr: any) {
      if (condErr.name === 'ConditionalCheckFailedException') {
        return NextResponse.json({
          error: 'Another member is already checking out',
          alreadyCheckedOut: true,
        }, { status: 409 });
      }
      throw condErr;
    }

    // ====== STEP 3: Fetch all cart items ======
    const itemsResult = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: { ':pk': `CART#${cartId}`, ':sk': 'ITEM#' },
    }));

    const items = itemsResult.Items || [];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // ====== STEP 4: Calculate totals and splits ======
    const totalAmount = items.reduce((s: number, i: any) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
    const memberIds: string[] = cart.memberIds || [userId];
    const cartSplitMode = splitMode || cart.splitMode || 'auto';
    const isAmazonPay = paymentMethod === 'amazon_pay';
    const coinsEarned = isAmazonPay ? Math.round(totalAmount * 0.05) : 0;

    // Calculate member payments
    const memberPayments = memberIds.map((memberId: string) => {
      let amount = 0;
      if (cartSplitMode === 'family') {
        amount = memberId === userId ? totalAmount : 0;
      } else if (cartSplitMode === 'equal') {
        amount = Math.round(totalAmount / memberIds.length);
      } else {
        // Auto: personal items + share of shared
        const personalTotal = items
          .filter((i: any) => i.addedBy === memberId && !i.isShared)
          .reduce((s: number, i: any) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
        const sharedTotal = items
          .filter((i: any) => i.isShared)
          .reduce((s: number, i: any) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
        const sharedShare = Math.round(sharedTotal / memberIds.length);
        amount = personalTotal + sharedShare;
      }
      return {
        memberId,
        amount,
        method: memberId === userId ? paymentMethod : 'pending',
        status: memberId === userId ? 'paid' : 'pending',
        coinsEarned: memberId === userId ? coinsEarned : 0,
      };
    });

    // ====== STEP 5: Create order for ALL members ======
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const orderData = {
      id: orderId,
      cartId,
      items,
      totalAmount,
      splitMode: cartSplitMode,
      memberPayments,
      deliverySlot,
      paymentMethod,
      paidBy: userId,
      status: 'confirmed',
      coinsEarned,
      createdAt: new Date().toISOString(),
    };

    // Save order for each member
    for (const memberId of memberIds) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...Keys.order(orderId),
          pk: `USERORDER#${memberId}`,
          sk: `ORDER#${orderId}`,
          ...orderData,
        },
      }));
    }

    // ====== STEP 6: Create split requests for non-payer members ======
    const splits: any[] = [];
    if (cartSplitMode !== 'family') {
      for (const payment of memberPayments) {
        if (payment.memberId === userId || payment.amount <= 0) continue;

        const splitId = `spr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const memberItems = items
          .filter((i: any) => i.addedBy === payment.memberId && !i.isShared)
          .map((i: any) => ({ productId: i.product?.id, name: i.product?.name, quantity: i.quantity, price: i.product?.price }));

        const splitData = {
          pk: `USERSPLITS#${payment.memberId}`,
          sk: `SPLIT#${splitId}`,
          id: splitId,
          orderId,
          fromMemberId: payment.memberId,
          toMemberId: userId,
          payerUserId: userId,
          amount: payment.amount,
          splitMode: cartSplitMode,
          items: memberItems,
          status: 'pending',
          orderTotal: totalAmount,
          deliverySlot,
          createdAt: new Date().toISOString(),
        };

        await client.send(new PutCommand({ TableName: TABLE_NAME, Item: splitData }));
        splits.push(splitData);
      }
    }

    // ====== STEP 7: Add coins for payer (only Amazon Pay) ======
    if (isAmazonPay && coinsEarned > 0) {
      // Get current balance
      const balResult = await client.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: Keys.coins(userId),
      }));
      const currentBalance = balResult.Item?.balance || 0;
      const newBalance = currentBalance + coinsEarned;

      await client.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: Keys.coins(userId),
        UpdateExpression: 'SET balance = :bal',
        ExpressionAttributeValues: { ':bal': newBalance },
      }));

      // Log transaction
      const txId = `tx-${Date.now()}`;
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: `COINS#${userId}`,
          sk: `TX#${txId}`,
          id: txId,
          amount: coinsEarned,
          reason: `Order #${orderId.slice(-6)} via Amazon Pay`,
          balance: newBalance,
          createdAt: new Date().toISOString(),
        },
      }));
    }

    // ====== STEP 8: Delete all cart items ======
    for (const item of items) {
      await client.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { pk: `CART#${cartId}`, sk: `ITEM#${item.id}` },
      }));
    }

    // ====== STEP 9: Reset cart (keep alive, clear checkedOut) ======
    await client.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: Keys.cart(cartId),
      UpdateExpression: 'SET checkedOut = :co, checkedOutBy = :by, checkedOutAt = :at',
      ExpressionAttributeValues: {
        ':co': false,
        ':by': '',
        ':at': '',
      },
    }));

    // Get final balance if coins were earned
    let finalBalance: number | undefined;
    if (isAmazonPay) {
      const balCheck = await client.send(new GetCommand({ TableName: TABLE_NAME, Key: Keys.coins(userId) }));
      finalBalance = balCheck.Item?.balance || 0;
    }

    return NextResponse.json({
      success: true,
      order: orderData,
      splits,
      coinsEarned,
      newBalance: finalBalance,
    });

  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
