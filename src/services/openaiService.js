const openaiClient = require('../config/openaiConfig');

async function generateTriviaQuestion() {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {"role": "system", "content": "You are an assistant tasked with creating trivia questions. Each trivia item should consist of a question followed by an answer separated by a line that says 'Answer:'."},
            {"role": "system", "content": "Create a trivia question and provide the answer."}
        ]
    });

    const parts = response.data.choices[0].text.trim().split('\nAnswer: ');
    if (parts.length < 2) {
        throw new Error('Failed to parse the question and answer');
    }

    const question = parts[0].trim();
    const answer = parts[1].trim();

    return { question, answer };
}

async function evaluateAnswer(userAnswer, correctAnswer) {
    const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {"role": "system", "content": "You are an assistant tasked with evaluating trivia answers. Simply state whether the user's answer is correct."},
            {"role": "user", "content": `Question: What is the correct answer? Answer: ${correctAnswer}`},
            {"role": "user", "content": `User's answer: ${userAnswer}`},
            {"role": "system", "content": "Is the user's answer correct? Respond with 'correct' or 'incorrect' only."}
        ]
    });

    return response.data.choices[0].text.trim().toLowerCase() === 'correct';
}

module.exports = { generateTriviaQuestion, evaluateAnswer };
