const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ================= CONFIG =================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ALLOWED_NUMBER = "918580653074"; // jis person ko reply chahiye

let aiCallsToday = 0;
const MAX_AI_CALLS = 120; // free safety

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

// ================= DAILY RESET =================
setInterval(() => {
  aiCallsToday = 0;
}, 24 * 60 * 60 * 1000);

// ================= HELPERS =================
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  // 20 sec – 60 sec
  return Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
}

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Groq hybrid bot is live 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, sender } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message missing" });
    }

    // sirf ek specific number allow
    if (sender && sender !== ALLOWED_NUMBER) {
      return res.json({ reply: "ignored" });
    }

    // human-like delay
    await delay(randomDelay());

    const lowerMsg = message.toLowerCase();

    // quick predefined replies
    for (let r of quickReplies) {
      if (lowerMsg.includes(r)) {
        return res.json({ reply: r });
      }
    }

    // short message → no AI
    if (message.length < 15 && !message.includes("?")) {
      const r =
        quickReplies[Math.floor(Math.random() * quickReplies.length)];
      return res.json({ reply: r });
    }

    // AI daily limit crossed
    if (aiCallsToday >= MAX_AI_CALLS) {
      return res.json({
        reply: "abhi thoda busy hu 😅 baad me baat karte"
      });
    }

    // ================= AI CALL =================
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
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices[0].message.content ||
      "theek hai 😅";

    return res.json({ reply });

  } catch (err) {
    return res.json({
      reply: "network thoda slow hai 😅 baad me baat karte"
    });
  }
});

// ================= START =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Groq hybrid bot running on port", PORT);
});
