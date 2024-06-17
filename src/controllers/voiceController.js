const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { generateTriviaQuestion, evaluateAnswer } = require('../services/openaiService');
const { updateScore, getUser } = require('../services/couchbaseService');

async function handleIncomingCall(req, res) {
  const twiml = new VoiceResponse();
  const question = await generateTriviaQuestion();

  twiml.say('Welcome to AI Trivia Game!');
  twiml.say(question);

  twiml.gather({
    input: 'speech',
    timeout: 5,
    action: '/voice/answer',
    method: 'POST',
  });

  res.type('text/xml');
  res.send(twiml.toString());
}

async function handleAnswer(req, res) {
  const twiml = new VoiceResponse();
  const userAnswer = req.body.SpeechResult;
  const isCorrect = await evaluateAnswer(userAnswer);

  if (isCorrect) {
    twiml.say('Correct! You earned a point.');
    await updateScore(req.body.From, 1);
  } else {
    twiml.say('Incorrect. Better luck next time.');
  }

  res.type('text/xml');
  res.send(twiml.toString());
}

module.exports = { handleIncomingCall, handleAnswer };
