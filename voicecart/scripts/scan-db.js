const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'VoiceCart';
const region = process.env.AWS_REGION || 'ap-south-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error('❌ AWS credentials not found in .env or .env.local');
  process.exit(1);
}

const client = new DynamoDBClient({ region, credentials: { accessKeyId, secretAccessKey } });
const docClient = DynamoDBDocumentClient.from(client);

async function scanDb() {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    console.log(`\n📦 Scan of table '${TABLE_NAME}':`);
    console.log(`Total Items: ${data.Count}\n`);
    if (data.Items && data.Items.length > 0) {
      console.log(JSON.stringify(data.Items, null, 2));
    } else {
      console.log('Table is empty.');
    }
  } catch (err) {
    console.error('❌ Failed to scan table:', err);
  }
}

scanDb();
