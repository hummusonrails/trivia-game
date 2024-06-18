const { OpenAI } = require('openai');

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openaiClient;
