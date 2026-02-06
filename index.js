const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("Bot live hai 🚀 Gemini REST API connected");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const sender = req.body.sender || "unknown";

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Tum Shriniwas ho. MITS Gwalior ke student ho. Hinglish me short aur casual reply do.\n\nUser: " +
                    message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: "AI Processing Failed",
        details: data.error?.message || "Unknown Gemini error"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Reply generate nahi ho paaya";

    return res.json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "AI Processing Failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
