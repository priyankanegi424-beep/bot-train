const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ALLOWED_NUMBER = "918580653074"; // <-- yahan target number

let aiCallsToday = 0;
const MAX_AI_CALLS = 120;

const quickReplies = [
  "haan",
  "theek hai",
  "ok",
  "samajh gaya",
  "baad me baat karte",
  "haha 😅",
  "dekhta hu",
  "thoda busy hu abhi"
];

// reset daily
setInterval(() => {
  aiCallsToday = 0;
}, 24 * 60 * 60 * 1000);

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
}

app.post("/chat", async (req, res) => {
  const { message, sender } = req.body;

  // sirf ek number allow
  if (sender !== ALLOWED_NUMBER) {
    return res.json({ reply: "ignored" });
  }

  // human-like delay
  await delay(randomDelay());

  // predefined reply check
  const lowerMsg = message.toLowerCase();
  for (let r of quickReplies) {
    if (lowerMsg.includes(r)) {
      return res.json({ reply: r });
    }
  }

  // AI limit crossed
  if (aiCallsToday >= MAX_AI_CALLS) {
    return res.json({
      reply: "abhi thoda busy hu 😅 baad me baat karte"
    });
  }

  // short msg → no AI
  if (message.length < 15 && !message.includes("?")) {
    const r = quickReplies[Math.floor(Math.random() * quickReplies.length)];
    return res.json({ reply: r });
  }

  // 🔥 AI CALL
  try {
    aiCallsToday++;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "Tum Shriniwas ho. Hinglish me short, casual, friendly replies do."
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (e) {
    res.json({
      reply: "network thoda slow hai 😅 baad me baat karte"
    });
  }
});

app.listen(10000, () => {
  console.log("Hybrid Groq bot running on port 10000");
});
