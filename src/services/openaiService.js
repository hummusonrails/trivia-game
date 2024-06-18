const openaiClient = require('../config/openaiConfig');
const OPENAI_MODEL = 'gpt-4o';

async function createChatCompletion(messages) {
    return await openaiClient.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messages
    });
}

async function generateTriviaQuestion() {
    const response = await createChatCompletion([
        {"role": "system", "content": "You are an assistant tasked with creating trivia questions. Each trivia item should consist of a question followed by an answer separated by a line that says 'Answer:'."},
        {"role": "system", "content": "Create a trivia question and provide the answer."}
    ]);

    if (!response.data || !response.data.choices || !response.data.choices.length || !response.data.choices[0].text) {
        throw new Error('Invalid response structure from OpenAI API');
    }

    const parts = response.data.choices[0].text.trim().split('\nAnswer: ');
    if (parts.length < 2) {
        throw new Error('Failed to parse the question and answer');
    }

    const question = parts[0].trim();
    const answer = parts[1].trim();

    return { question, answer };
}

async function evaluateAnswer(userAnswer, correctAnswer) {
    let response;
    try {
        response = await createChatCompletion([
            {"role": "system", "content": "You are an assistant tasked with evaluating trivia answers. Simply state whether the user's answer is correct."},
            {"role": "user", "content": `Question: What is the correct answer? Answer: ${correctAnswer}`},
            {"role": "user", "content": `User's answer: ${userAnswer}`},
            {"role": "system", "content": "Is the user's answer correct? Respond with 'correct' or 'incorrect' only."}
        ]);
    } catch (error) {
        throw new Error('Failed to evaluate the answer: ' + error.message);
    }

    return response.data.choices[0].text.trim().toLowerCase() === 'correct';
}

module.exports = { generateTriviaQuestion, evaluateAnswer };
