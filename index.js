const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: "hello" }] }
      ]
    });

    res.json({
      reply: result.candidates[0].content.parts[0].text
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(10000);
