const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { generateTriviaQuestion, evaluateAnswer } = require('../services/openaiService');
const { updateScore, getUser } = require('../services/couchbaseService');

async function handleIncomingCall(req, res) {
    const { question, answer } = await generateTriviaQuestion();

    req.session.question = question;
    req.session.answer = answer;

    const twiml = new VoiceResponse();
    twiml.say({
        voice: 'Polly.Justin',
        language: 'en-GB'
    },
        'Welcome to the AI Trivia Game! Communications brought to you by Twilio, questions from Chat GPT and data is powered by Couchbase.'
    );

    twiml.say({
        voice: 'Polly.Nicole',
        language: 'en-AU'
    },
        question
    );

    const gather = twiml.gather({
        action: '/voice/answer',
        method: 'POST',
        input: 'dtmf speech',
        finishOnKey: '#'
    });

    gather.say({
        voice: 'Polly.Justin',
        language: 'en-GB'
    },
        'Please say your answer and press the pound key when you are done.'
    );

    twiml.say({
        voice: 'Polly.Emma',
        language: 'en-GB'
    },
        'Please respond to the question.'
    );

    res.type('text/xml');
    res.send(twiml.toString());
}

async function handleAnswer(req, res) {
    const twiml = new VoiceResponse();

    const phoneNumber = req.body.From;
    const userResponse = req.body.SpeechResult || req.body.Digits;
    
    if (userResponse) {
        const isCorrect = await evaluateAnswer(userResponse, req.session.answer);
        if (isCorrect) {
            twiml.say('Your answer is correct. Congratulations!');
            await updateScore(phoneNumber, 1);
        } else {
            twiml.say('That is incorrect. Try another question.');
        }
    } else {
        twiml.say('No answer detected, please try again.');
        twiml.redirect('/voice');
    }

    res.type('text/xml');
    res.send(twiml.toString());
}

module.exports = { handleIncomingCall, handleAnswer };
