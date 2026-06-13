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
    
    // We get splits where the user is either the requester (fromMemberId) or the payer (toMemberId).
    // Let's just scan for now, or if we want to be efficient, we can query by USERSPLITS index.
    // For simplicity of single table design, we can query the USERSPLITS#userId index.
    const result = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: { ':pk': `USERSPLITS#${userId}`, ':sk': 'SPLIT#' },
    }));

    return NextResponse.json({ splits: result.Items || [] });
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
      createdAt: new Date().toISOString(),
    };

    await client.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    // Also store copies for both users for easy querying
    if (split.fromMemberId) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, ...Keys.userSplits(split.fromMemberId), sk: `SPLIT#${splitId}` },
      }));
    }
    if (split.toMemberId) {
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, ...Keys.userSplits(split.toMemberId), sk: `SPLIT#${splitId}` },
      }));
    }

    return NextResponse.json({ split: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


