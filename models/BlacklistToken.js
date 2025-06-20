const connectToDb = require('../db');

async function addTokenToBlacklist(token, expiresAt) {
  const db = await connectToDb();
  const collection = db.collection('blacklisted_tokens');
  await collection.insertOne({ token, expiresAt });
}

async function isTokenBlacklisted(token) {
  const db = await connectToDb();
  const collection = db.collection('blacklisted_tokens');
  const found = await collection.findOne({ token });
  return !!found;
}

module.exports = {
  addTokenToBlacklist,
  isTokenBlacklisted,
};