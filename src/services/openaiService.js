const openaiClient = require('../config/openaiConfig');

async function generateTriviaQuestion() {
  const response = await openaiClient.post('/engines/davinci-codex/completions', {
    prompt: 'Generate a trivia question.',
    max_tokens: 50,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}

async function evaluateAnswer(answer) {
  const response = await openaiClient.post('/engines/davinci-codex/completions', {
    prompt: `Is the following answer correct? ${answer}`,
    max_tokens: 10,
    temperature: 0.5,
  });
  return response.data.choices[0].text.trim().toLowerCase() === 'yes';
}

module.exports = { generateTriviaQuestion, evaluateAnswer };
