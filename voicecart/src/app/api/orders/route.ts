import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const client = getDynamoClient();
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: { ':pk': `USERORDER#${userId}`, ':sk': 'ORDER#' },
    }));

    return NextResponse.json({ orders: result.Items || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const client = getDynamoClient();

    const orderId = `ord-${Date.now()}`;

    // #3 Fix: Server-side validation of order total from items
    if (order.items && order.items.length > 0) {
      const serverTotal = order.items.reduce((s: number, i: any) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
      if (order.totalAmount && Math.abs(order.totalAmount - serverTotal) > serverTotal * 0.05) {
        return NextResponse.json({ error: 'Order total mismatch. Please refresh and try again.' }, { status: 400 });
      }
      order.totalAmount = serverTotal;
    }

    // #10 Fix: Prevent double checkout — check if cart already checked out
    if (order.cartId) {
      const cartResult = await client.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: Keys.cart(order.cartId),
      }));
      if (cartResult.Item?.checkedOut) {
        return NextResponse.json({ error: 'This cart has already been checked out.', alreadyCheckedOut: true }, { status: 409 });
      }
    }

    const orderItem = {
      ...Keys.order(orderId),
      id: orderId,
      ...order,
      pk: `USERORDER#${order.userId || 'unknown'}`,
      sk: `ORDER#${orderId}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Store for the payer
    await client.send(new PutCommand({ TableName: TABLE_NAME, Item: orderItem }));

    // Also store for all other members
    if (order.memberIds && order.memberIds.length > 0) {
      for (const memberId of order.memberIds) {
        if (memberId === order.userId) continue;
        await client.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: { ...orderItem, pk: `USERORDER#${memberId}`, sk: `ORDER#${orderId}` },
        }));
      }
    }

    return NextResponse.json({ order: orderItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
