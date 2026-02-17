const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askSensei = async (req, res) => {
  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Usar "gemini-1.5-flash" pero con la configuración mínima
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Eres Sensei IA, un tutor amable. Responde brevemente con emojis a: ${message}`;

    console.log("📡 Solicitando respuesta a Gemini...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("✅ Respuesta obtenida");
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("❌ ERROR EN BACKEND:", error);
    res.status(500).json({ reply: "Error de conexión con Sensei.", error: error.message });
  }
};