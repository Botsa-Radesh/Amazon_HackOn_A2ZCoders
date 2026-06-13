import { NextRequest, NextResponse } from 'next/server';
import { getDynamoClient, TABLE_NAME } from '@/lib/dynamodb';
import { Keys } from '@/lib/schema';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const client = getDynamoClient();

    const setExpr = Object.keys(updates).map(k => `#${k} = :${k}`).join(', ');
    const attrNames: Record<string, string> = {};
    const attrValues: Record<string, any> = {};
    for (const [k, v] of Object.entries(updates)) {
      attrNames[`#${k}`] = k;
      attrValues[`:${k}`] = v;
    }

    await client.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: Keys.splitRequest(id),
      UpdateExpression: `SET ${setExpr}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
    }));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
