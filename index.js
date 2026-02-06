const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 1. Middlewares: Taaki kisi bhi format ka data (JSON ya URL-encoded) miss na ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Gemini Setup
// Yaad se Render dashboard mein 'GEMINI_API_KEY' set kar dena
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Health Check: Browser mein check karne ke liye (GET request)
app.get('/', (req, res) => {
    res.send("Shriniwas, aapka bot bilkul ready aur online hai! 🚀");
});

// 4. Main Chat Route: WhatsApp AutoResponder isse call karega
app.post('/chat', async (req, res) => {
    try {
        // Alag-alag apps alag keys bhejti hain, isliye sab cover kiye hain
        const message = req.body.message || req.body.text || req.query.message;
        const sender = req.body.sender || req.query.sender || "Unknown Number";

        console.log(`--- New Message Received ---`);
        console.log(`From: ${sender}`);
        console.log(`Content: ${message}`);

        // Validation: Agar message khali hai toh error bhej do
        if (!message || message === "undefined") {
            console.log("Error: Message is undefined or empty.");
            return res.status(400).json({ error: "Message missing" });
        }

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Ab ye latest library ke saath kaam karega
    systemInstruction: "Tum Shriniwas ho. MITS Gwalior ke student ho. Hinglish me baat karo."
});

        // Generate Reply
        const result = await model.generateContent(String(message));
        const response = await result.response;
        const replyText = response.text();

        console.log(`AI Reply: ${replyText}`);
        console.log(`----------------------------`);

        // AutoResponder isi 'reply' key ko read karke WhatsApp pe bhejega
        return res.json({ reply: replyText });

    } catch (err) {
        // Detailed logging taaki hum Render dashboard me exact galti pakad sakein
        console.error("CRITICAL ERROR IN CHAT ROUTE:", err);
        return res.status(500).json({ 
            error: "AI Processing Failed", 
            details: err.message 
        });
    }
});

// 5. Port Binding: Render ke liye optimized
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
