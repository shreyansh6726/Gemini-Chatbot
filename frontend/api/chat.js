const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  const { message, image, imageType } = req.body || {};
  const promptText = typeof message === 'string' && message.trim() ? message.trim() : 'Describe this image.';

  try {
    const ai = new GoogleGenAI({ apiKey });

    const parts = [{ text: promptText }];
    if (image && imageType) {
      parts.push({
        inlineData: {
          mimeType: imageType,
          data: image
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
      config: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 32768,
        responseModalities: ['TEXT']
      }
    });

    return res.status(200).json({
      response: response.text || ''
    });
  } catch (error) {
    console.error('Gemini serverless error:', error);
    return res.status(500).json({
      error: 'Gemini request failed',
      detail: error?.message || String(error)
    });
  }
};
