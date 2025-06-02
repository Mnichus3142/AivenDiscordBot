import { config } from "dotenv";
config({ path: "../.env" });

import { payload } from "../types/payload";

const express = require('express')
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const webhookUrl = process.env.WEBHOOK;

if (!webhookUrl) {
  console.error("Webhook URL is not defined in environment variables");
  process.exit(1);
}

const isPayload = (obj: any): obj is payload => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.application === "string" &&
    typeof obj.type === "string" &&
    typeof obj.message === "string" &&
    typeof obj.timestamp === "string"
  )
}

const sendDiscordMessage = async (message: payload) => {
  const newMessage = {
    "content": null,
    "embeds": [
      {
        "title": `${message.application} - ${message.type}`,
        "description": message.message,
        "timestamp": message.timestamp,
        "color": message.type === "Error" ? 0xFF0000 : 0x00FF00,
      }
    ]
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  })
    .then((response) => {
      if (!response.ok) {
        response.text().then((text) => console.error("Error:", text));
      }
    })
    .catch(console.error);
}

app.post('/send', async (req, res) => {  
  if (!req.body.payload) {
    return res.status(400).send('No payload provided');
  }

  if (!isPayload(req.body.payload)) {
    return res.status(400).send('Invalid payload format');
  }

  const payload: payload = req.body.payload;

  await sendDiscordMessage(payload);

  res.status(200).send('Webhook received');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Webhook sender is listening on ${port}`)
})
