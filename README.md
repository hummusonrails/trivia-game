# SmartyCall: An AI Trivia Game

SmartyCall is an interactive trivia game that uses Node.js, Couchbase, Twilio Voice and SMS APIs, and the OpenAI API to deliver trivia questions to players via phone calls and SMS. Players can register via SMS, receive trivia questions through phone calls, and get their scores tracked in real-time.

This application was built for the [Twilio Hackathon Challenge on devto](https://dev.to/devteam/join-us-for-the-twilio-challenge-5000-in-prizes-4fdi).

## Features

- User registration via SMS
- AI-generated trivia questions using OpenAI API
- Cached trivia questions in Couchbase
- Interactive voice-based gameplay with Twilio Voice
- Score tracking and leaderboard via Couchbase
- Delivery status tracking for SMS messages

## Technologies Used

- Node.js
- Express.js
- [Couchbase](https://cloud.couchbase.com/)
- [Twilio Voice and SMS APIs](https://www.twilio.com/)
- [OpenAI API](https://www.openai.com/)

## Prerequisites

- Node.js and npm installed
- Couchbase Capella account
- Twilio account with a phone number
- OpenAI API key

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hummusonrails/trivia-game.git
   cd trivia-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:

   ```env
   COUCHBASE_URL=couchbases://cb.<your-endpoint>.cloud.couchbase.com
   COUCHBASE_USER=your-couchbase-username
   COUCHBASE_PASSWORD=your-couchbase-password
   COUCHBASE_BUCKET=your-couchbase-bucket-name
   COUCHBASE_BUCKET_QUESTIONS=your-couchbase-bucket-questions-name
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone-number
   OPENAI_API_KEY=your-openai-api-key
   SESSION_SECRET=your-session-secret
   ```

4. **Run the application:**
   ```bash
   npm run start
   ```

5. **Expose your local server to the internet:**
   Use [ngrok](https://ngrok.com/) to expose your local server to the internet for Twilio webhooks.
   ```bash
   ngrok http 3000
   ```

## Usage

### Register a User via SMS

1. **Send an SMS:**
   Text "JOIN" to your Twilio phone number to register for the game.
2. **Receive a welcome message:**
   You will receive a welcome message and instructions on how to start the game.

### Start the Game

1. **Text "JOIN" to your Twilio phone number:**
   You will receive a message with the phone number to call to start the game.
2. **Call the provided number:**
   You will receive a welcome message followed by a trivia question. Each unique question is cached in Couchbase to avoid repeating the same question.
3. **Answer the trivia question:**
   Respond via voice, and you will receive feedback on whether your answer was correct. Your score will be tracked.

### Check Your Score

1. **Text "LEADERBOARD" to your Twilio phone number:**
   You will receive a message with your current score and rank on the leaderboard.

### Delivery Status Callback

To get detailed delivery status for your messages, set the "Status Callback URL" in your Twilio settings to:
```
http://<your-ngrok-url>/callback/status
```

## File Structure

```
ai-trivia-game/
├── src/
│   ├── controllers/
│   │   ├── voiceController.js
│   │   ├── smsController.js
│   │   ├── callbackController.js
│   ├── services/
│   │   ├── openaiService.js
│   │   ├── twilioService.js
│   │   ├── couchbaseService.js
│   ├── routes/
│   │   ├── voiceRoutes.js
│   │   ├── smsRoutes.js
│   │   ├── callbackRoutes.js
│   ├── config/
│   │   ├── couchbaseConfig.js
│   │   ├── twilioConfig.js
│   │   ├── openaiConfig.js
│   ├── app.js
│   └── server.js
├── .env
├── package.json
├── package-lock.json
└── README.md
```

## Contributing

1. **Fork the repository**
2. **Create a new branch (`git checkout -b feature/your-feature-name`)**
3. **Commit your changes (`git commit -m 'Add some feature'`)**
4. **Push to the branch (`git push origin feature/your-feature-name`)**
5. **Create a new Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

Please read the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for details on the standards for collaboration within this project.