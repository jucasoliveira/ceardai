// Usage: npx tsx scripts/promote-admin.ts <email>
// Promotes a user to admin tier

import { MongoClient } from "mongodb";
import "dotenv/config";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx scripts/promote-admin.ts <email>");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI!);

async function main() {
  await client.connect();
  const db = client.db();
  const result = await db
    .collection("user")
    .updateOne({ email }, { $set: { tier: "admin" } });

  if (result.matchedCount === 0) {
    console.error(`No user found with email: ${email}`);
  } else {
    console.log(`Promoted ${email} to admin`);
  }
  await client.close();
}

main().catch(console.error);
