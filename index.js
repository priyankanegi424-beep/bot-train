const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

// Ye dono middlewares zaroori hain
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // AutoResponder alag-alag keys bhej sakta hai, sabko check karo
        const message = req.body.message || req.body.text || req.query.message;
        const sender = req.body.sender || req.query.sender || "Unknown";

        console.log(`Log - Message: ${message}, Sender: ${sender}`);

        if (!message || message === "undefined") {
            return res.status(400).json({ error: "Empty message" });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short aur casual replies do."
        });

        const result = await model.generateContent(String(message));
        const response = await result.response;
        
        return res.json({ reply: response.text() });

    } catch (err) {
        console.error("AI Error:", err.message);
        return res.status(500).json({ error: "AI Failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
