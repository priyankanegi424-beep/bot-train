const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

// Ye line sabse upar honi chahiye routes se pehle
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("Shriniwas's Bot is Running!"));

app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message || req.body.text || req.query.message;
        const sender = req.body.sender || req.query.sender;
        console.log(`Log - Message: ${message}, Sender: ${sender}`);

        // Error handling if data is missing
        if (!message || message === "undefined") {
            console.log("Error: Message body is empty or undefined");
            return res.status(400).json({ error: "No message received" });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short aur casual replies do."
        });

        const result = await model.generateContent(String(message));
        const response = await result.response;
        
        return res.json({ reply: response.text() });

    } catch (err) {
        console.error("Internal Server Error:", err.message);
        return res.status(500).json({ error: "AI Processing Failed" });
    }
});

// Render port binding
const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
