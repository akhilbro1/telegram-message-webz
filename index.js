const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BOT_TOKEN = '7745495114:AAHdXjcUMt3nI_lahgXjRaseuf2TXDBPXo8';
const CHAT_ID = '7992098739';

app.post('/send', async (req, res) => {
  const { sender, receiver, message } = req.body;

  if (!sender || !receiver || !message) {
    return res.status(400).send('Missing sender, receiver, or message');
  }

  // Don't send if sender is "admin"
  if (sender.toLowerCase() === 'admin') {
    return res.send('Message from admin skipped');
  }

  // Censor messages that start with sensitive phrases
  let censoredMessage = message;
  const lower = message.toLowerCase();
  if (lower.startsWith('amazon login') || lower.startsWith('amazon password')) {
    censoredMessage = '****';
  }

  // Telegram Markdown formatted message
  const text = `*New message from ${sender}:*\n\`\`\`\n${censoredMessage}\n\`\`\``;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });
    res.send('Telegram message sent');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Telegram send failed');
  }
});

app.get('/', (req, res) => {
  res.send(`<h3>Telegram Relay Server is running.</h3><p>Use POST /send with sender, receiver, and message.</p>`);
});

app.listen(3000, '0.0.0.0', () => console.log('Telegram relay listening on port 3000'));
