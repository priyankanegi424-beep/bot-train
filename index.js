const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== GEMINI SETUP ================== */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ================== HEALTH CHECK ================== */
app.get("/", (req, res) => {
  res.send("Bot live hai 🚀 Gemini connected successfully");
});

/* ================== CHAT ROUTE ================== */
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message || req.body.text || req.query.message;
    const sender = req.body.sender || req.query.sender || "Unknown";

    console.log("From:", sender);
    console.log("Message:", message);

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    /* ✅ CORRECT MODEL */
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
      systemInstruction:
        "Tum Shriniwas ho. Madhav Institute of Technology & Science (MITS) Gwalior ke student ho. Hinglish me short aur casual replies do."
    });

    const result = await model.generateContent(message);
    const replyText = result.response.text();

    console.log("AI Reply:", replyText);

    return res.json({ reply: replyText });

  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({
      error: "AI Processing Failed",
      details: err.message
    });
  }
});

/* ================== PORT ================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
