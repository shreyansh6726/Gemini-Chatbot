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
    const input = [{ text: promptText }];

    if (image && imageType) {
      input.push({
        inlineData: {
          mimeType: imageType,
          data: image
        }
      });
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash-image',
      input,
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 32768,
        topP: 0.95
      },
      responseModalities: ['image', 'text']
    });

    const textParts = [];
    const imageParts = [];

    if (interaction.steps) {
      for (const step of interaction.steps) {
        if (step.type !== 'model_output' || !step.content) continue;

        for (const part of step.content) {
          if (part.type === 'text' && part.text) {
            textParts.push(part.text);
          } else if (part.type === 'image' && part.data) {
            imageParts.push(`data:image/png;base64,${part.data}`);
          }
        }
      }
    }

    return res.status(200).json({
      response: textParts.join('\n\n'),
      images: imageParts
    });
  } catch (error) {
    console.error('Gemini serverless error:', error);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
};
