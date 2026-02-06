const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Bot live hai 🚀 Gemini-Pro connected");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const sender = req.body.sender || "unknown";

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction:
        "Tum Shriniwas ho. MITS Gwalior ke student ho. Hinglish me short aur casual reply do."
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

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
