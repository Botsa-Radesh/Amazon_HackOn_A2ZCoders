import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const client = getDynamoClient();
    
    // Query splits stored under this user's ID
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: { ':pk': `USERSPLITS#${userId}`, ':sk': 'SPLIT#' },
    }));

    let splits = result.Items || [];

    // Also scan for splits where this user is fromMemberId or toMemberId
    // (handles cases where member ID differs from auth user ID)
    if (splits.length === 0) {
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      const scanResult = await client.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(pk, :pk) AND (fromMemberId = :uid OR toMemberId = :uid)',
        ExpressionAttributeValues: { ':pk': 'SPLIT#', ':uid': userId },
      }));
      splits = scanResult.Items || [];
    }

    return NextResponse.json({ splits });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const split = await req.json();
    const client = getDynamoClient();

    const splitId = split.id || `spr-${Date.now()}`;
    const item = {
      ...Keys.splitRequest(splitId),
      id: splitId,
      ...split,
      createdAt: split.createdAt || new Date().toISOString(),
    };

    await client.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    // Store copies for both users for easy querying
    // Store under fromMemberId
    if (split.fromMemberId) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, pk: `USERSPLITS#${split.fromMemberId}`, sk: `SPLIT#${splitId}` },
      }));
    }
    // Store under toMemberId
    if (split.toMemberId) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, pk: `USERSPLITS#${split.toMemberId}`, sk: `SPLIT#${splitId}` },
      }));
    }
    // Also store under payerUserId if provided (auth user ID of the payer)
    if (split.payerUserId && split.payerUserId !== split.toMemberId) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, pk: `USERSPLITS#${split.payerUserId}`, sk: `SPLIT#${splitId}` },
      }));
    }

    return NextResponse.json({ split: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


