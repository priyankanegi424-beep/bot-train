const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middlewares for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gemini Setup using Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health Check for Browser
app.get('/', (req, res) => {
    res.send("Shriniwas, aapka bot bilkul ready aur online hai! 🚀");
});

// Main Chat Route
app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message || req.body.text || req.query.message;
        const sender = req.body.sender || req.query.sender || "Unknown Number";

        console.log(`--- New Message ---`);
        console.log(`From: ${sender} | Content: ${message}`);

        if (!message || message === "undefined") {
            return res.status(400).json({ error: "Message missing" });
        }

        // STABLE MODEL: Switching to gemini-pro to avoid 404 error
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro", 
            systemInstruction: "Tum Shriniwas ho. Madhav Institute of Technology & Science (MITS) Gwalior ke student ho. Hinglish me baat karo. Short aur casual replies do."
        });

        const result = await model.generateContent(String(message));
        const response = await result.response;
        const replyText = response.text();

        console.log(`AI Reply: ${replyText}`);

        return res.json({ reply: replyText });

    } catch (err) {
        console.error("CRITICAL ERROR:", err.message);
        return res.status(500).json({ 
            error: "AI Processing Failed", 
            details: err.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
