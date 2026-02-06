const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Browser test ke liye
app.get('/', (req, res) => res.send("Shriniwas, bot is online! 🚀"));

app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message || req.body.text || req.query.message;
        const sender = req.body.sender || "Unknown";

        if (!message) return res.status(400).json({ error: "No message" });

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short replies do."
        });

        const result = await model.generateContent(String(message));
        const response = await result.response;
        
        return res.json({ reply: response.text() });

    } catch (err) {
        // EXACT error logs me dekhne ke liye
        console.error("DEBUG ERROR:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// Render dynamic port binding
const serverPort = process.env.PORT || 10000;
app.listen(serverPort, () => console.log(`Active on port ${serverPort}`));
