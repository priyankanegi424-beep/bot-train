const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    const { message, sender } = req.body;

    // console.log logic for debugging (Optional)
    console.log(`Message from ${sender}: ${message}`);

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short aur casual replies do."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        
        // Ab ye har number ke liye reply bhejega
        return res.json({ reply: response.text() });

    } catch (err) {
        console.error("AI Error:", err);
        return res.status(500).json({ error: "AI Error" });
    }
});

// Add this at the top with other routes
app.get('/', (req, res) => {
    res.send("Shriniwas's AI Bot is Live! 🚀");
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
