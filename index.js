const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

// SABSE IMPORTANT: Ye line req.body ko parse karne ke liye zaroori hai
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("Bot is Running!"));

app.post('/chat', async (req, res) => {
    try {
        // Destructure safely
        const { message, sender } = req.body;
        
        console.log(`Incoming: ${message} from ${sender}`);

        // Validation: Agar message undefined hai toh Gemini call mat karo
        if (!message) {
            return res.status(400).json({ error: "No message received" });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Tum Shriniwas ho. Hinglish me baat karo. Short aur casual replies do."
        });

        // Gemini call
        const result = await model.generateContent(String(message)); // Ensure it's a string
        const response = await result.response;
        
        return res.json({ reply: response.text() });

    } catch (err) {
        console.error("Detailed Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
