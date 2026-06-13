import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

    const client = getDynamoClient();
    const result = await client.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: Keys.appConfig(key),
    }));

    return NextResponse.json({ config: result.Item?.data || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { key, updates } = await req.json();
    if (!key || !updates) return NextResponse.json({ error: 'key and updates required' }, { status: 400 });

    const client = getDynamoClient();
    await client.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: Keys.appConfig(key),
      UpdateExpression: 'SET #data = :data',
      ExpressionAttributeNames: { '#data': 'data' },
      ExpressionAttributeValues: { ':data': updates },
    }));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
