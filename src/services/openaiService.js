const openaiClient = require('../config/openaiConfig');
const { checkQuestionExists, saveQuestion } = require('./couchbaseService');
const OPENAI_MODEL = 'gpt-4o';

async function createChatCompletion(messages) {
    return await openaiClient.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messages
    });
}


async function generateTriviaQuestion() {
    let response, question, answer;
    try {
        do {
            response = await createChatCompletion([
                {"role": "system", "content": "You are an assistant tasked with creating trivia questions. Each trivia item should consist of a question followed by an answer separated by a line that says 'Answer:'."},
                {"role": "system", "content": "Create a trivia question related to computers, API development, technology and other similar subjects and provide the answer."}
            ]);

            if (!response || !response.choices || !response.choices.length || !response.choices[0].message || !response.choices[0].message.content) {
                console.error("Unexpected API Response:", response);
                continue;
            }

            const parts = response.choices[0].message.content.trim().split('\nAnswer:');
            if (parts.length < 2) {
                console.error(`Failed to parse the question and answer from response: ${response.choices[0].message.content}`);
                continue;
            }

            question = parts[0].trim();
            answer = parts[1].trim();

            const exists = await checkQuestionExists(question);
            if (!exists) {
                await saveQuestion(question);
                break;
            }
        } while (true);
    } catch (error) {
        console.error("API Request Error:", error);
        throw new Error(`Failed to retrieve or save question: ${error.message}`);
    }

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
        console.error("API Request Error during evaluation:", error);
        throw new Error(`Failed to evaluate the answer: ${error.message}`);
    }

    if (!response || !response.choices || !response.choices.length || !response.choices[0].message || !response.choices[0].message.content) {
        console.error("Unexpected API Response during evaluation:", response);
        throw new Error('Invalid response structure from OpenAI API during evaluation');
    }

    const answerText = response.choices[0].message.content.trim().toLowerCase();

    return answerText === 'correct';
}


module.exports = { generateTriviaQuestion, evaluateAnswer };
