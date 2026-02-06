const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
app.get('/', (req, res) => res.send("Shriniwas, bot is online! 🚀"));
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: "AI Processing Failed",
        details: data.error?.message
      });
    }

    res.json({
      reply: data.candidates[0].content.parts[0].text
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(10000);
