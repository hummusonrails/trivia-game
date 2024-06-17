const connectToCouchbase = require('../config/couchbaseConfig');
const User = require('../models/userModel');


async function addUser(phoneNumber) {
    const { defaultCollection } = await connectToCouchbase();
    const userDoc = new User(phoneNumber);
    await defaultCollection.upsert(`user::${phoneNumber}`, userDoc);
  }

async function getUser(phoneNumber) {
  const { defaultCollection } = await connectToCouchbase();
  const result = await defaultCollection.get(`user::${phoneNumber}`);
  return result.content;
}

async function updateScore(phoneNumber, score) {
  const { defaultCollection } = await connectToCouchbase();
  const user = await getUser(phoneNumber);
  user.score += score;
  await defaultCollection.upsert(`user::${phoneNumber}`, user);
}

async function getLeaderboard() {
    const { defaultCollection } = await connectToCouchbase();
    const query = `SELECT phoneNumber, score FROM ${defaultCollection.scopeName}.${defaultCollection.name} WHERE type = 'user' ORDER BY score DESC LIMIT 10`;
    const result = await defaultCollection.cluster.query(query);
    return result.rows;
  }

module.exports = { addUser, getUser, updateScore, getLeaderboard };
