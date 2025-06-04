const axios = require("axios");

const askGemini = async (req, res) => {
  const { question } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Prompt instruction to Gemini
  const prompt = `
You are CureHut AI, a helpful assistant who only answers questions related to health, diseases, remedies, symptoms, or cures.

If the question is NOT related to health, respond with:
"I'm here to assist only with health-related topics. Please ask something related to health."

User question: ${question}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer received.";
    res.status(200).json({ answer: reply });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "AI response failed. Please try again." });
  }
};

module.exports = { askGemini };
