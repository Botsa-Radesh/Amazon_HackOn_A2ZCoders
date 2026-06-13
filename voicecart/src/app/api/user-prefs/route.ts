import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const client = getDynamoClient();
    const result = await client.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: Keys.userPref(userId),
    }));

    return NextResponse.json({ prefs: result.Item?.data || {} });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, updates } = await req.json();
    if (!userId || !updates) return NextResponse.json({ error: 'userId and updates required' }, { status: 400 });

    const client = getDynamoClient();

    // Ensure item exists first, or just use SET on top level fields. 
    // Since we store all prefs under a 'data' map or as root attributes, let's just merge into 'data'.
    const existing = await client.send(new GetCommand({ TableName: TABLE_NAME, Key: Keys.userPref(userId) }));
    const currentData = existing.Item?.data || {};
    const newData = { ...currentData, ...updates };

    await client.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: Keys.userPref(userId),
      UpdateExpression: 'SET #data = :data',
      ExpressionAttributeNames: { '#data': 'data' },
      ExpressionAttributeValues: { ':data': newData },
    }));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
