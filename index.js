const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Bot live hai 🚀 New Gemini SDK connected");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
    });

    const reply =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Reply generate nahi ho paaya";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "AI Processing Failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
