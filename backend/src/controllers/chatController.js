exports.askSensei = async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "Falta la API Key en el .env" });
    }

    console.log("📡 Conectando con Gemini (Modelo 2.5 Flash - Sabia Universal)...");

    // Usamos la API estable con tu modelo ultrarrápido 2.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  // AQUÍ ESTÁ EL CAMBIO A PROFESORA:
                  text: `Eres Sensei IA, una profesora y tutora sabia, amable y experta en absolutamente cualquier tema o materia del mundo. Responde de forma clara, didáctica y muy concisa (máximo 3 párrafos cortos) a la siguiente consulta del estudiante, usando algunos emojis para animar el texto: ${message}` 
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error devuelto por Google:", data.error);
      return res.status(response.status).json({ 
        reply: "La Sensei está meditando en la montaña y no puede responder ahora mismo. 🧘‍♀️🏔️", 
        error: data.error?.message || "Error desconocido"
      });
    }

    const text = data.candidates[0].content.parts[0].text;

    console.log("✅ Respuesta obtenida con éxito");
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN BACKEND:", error);
    res.status(500).json({ reply: "Fallo de conexión en el servidor.", error: error.message });
  }
};