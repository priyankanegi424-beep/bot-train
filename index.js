const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    const { message, sender } = req.body;

    // Check if it's the specific person
    if (sender.includes('918580653074')) {
        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short aur casual replies do."
            });

            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        } catch (err) {
            return res.status(500).json({ error: "AI Error" });
        }
    }
    res.json({ reply: "" }); // No reply for others
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
