const connectToCouchbase = require('../config/couchbaseConfig');
const connectToCouchbaseForAnswers = require('../config/couchbaseConfig');
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

async function checkQuestionExists(question) {
    const { defaultCollection } = await connectToCouchbaseForAnswers();
    const cluster = defaultCollection.cluster;
    const bucketName = process.env.COUCHBASE_BUCKET_QUESTIONS;
    const query = `SELECT COUNT(*) AS count FROM ${bucketName} WHERE question = $1`;
    const results = await cluster.query(query, { parameters: [question] });
    return results.rows[0].count > 0;
}

async function saveQuestion(question) {
    const { defaultCollection } = await connectToCouchbaseForAnswers();
    const docId = `question::${Date.now()}`;
    await defaultCollection.upsert(docId, { question });
}

async function getLeaderboard() {
    const { connection } = await connectToCouchbase();
    const collection = connection.defaultCollection();
    const query = `SELECT phoneNumber, score FROM ${collection.scopeName}.${collection.name} WHERE type = 'user' ORDER BY score DESC LIMIT 10`;
    const result = await collection.cluster.query(query);
    return result.rows;
  }

module.exports = { addUser, getUser, updateScore, getLeaderboard, checkQuestionExists, saveQuestion };
