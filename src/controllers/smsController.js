const { addUser } = require('../services/couchbaseService');
const { sendSms } = require('../services/twilioService');

async function handleIncomingSms(req, res) {
  const userMessage = req.body.Body.trim().toLowerCase();
  const userPhoneNumber = req.body.From;

  if (userMessage === 'join') {
    await addUser(userPhoneNumber);
    await sendSms(userPhoneNumber, 'Welcome to AI Trivia Game! Reply with START to begin.');
  } else if (userMessage === 'start') {
    await sendSms(userPhoneNumber, `Call +${process.env.TWILIO_PHONE_NUMBER} to start playing!`);
} else if (userMessage === 'leaderboard') {
    const user = await getUser(userPhoneNumber);
    if (!user) {
      await sendSms(userPhoneNumber, 'You are not registered. Reply with JOIN to register.');
      return res.sendStatus(200);
    }

    const leaderboard = await getLeaderboard();
    const userRank = leaderboard.findIndex(u => u.phoneNumber === userPhoneNumber) + 1;
    const userScore = user.score;

    let leaderboardMessage = `Your score is ${userScore} points. You are ranked ${userRank} on the leaderboard.\n\nTop Players:\n`;
    leaderboard.slice(0, 5).forEach((u, index) => {
      leaderboardMessage += `${index + 1}. ${u.phoneNumber}: ${u.score} points\n`;
    });

    await sendSms(userPhoneNumber, leaderboardMessage);
}

  res.sendStatus(200);
}

module.exports = { handleIncomingSms };
