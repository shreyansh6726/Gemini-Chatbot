const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

function loadEnvFile(envFilePath) {
  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const content = fs.readFileSync(envFilePath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const equalsIndex = trimmedLine.indexOf('=');
    if (equalsIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();
    if (!key || process.env[key] !== undefined) {
      return;
    }

    let value = trimmedLine.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

function loadLocalEnv() {
  const envDir = path.resolve(__dirname, '..');
  ['.env.local', '.env.development', '.env'].forEach((fileName) => {
    loadEnvFile(path.join(envDir, fileName));
  });
}

loadLocalEnv();

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

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Missing GEMINI_API_KEY',
      detail: 'Set GEMINI_API_KEY in the deployment environment or frontend/.env for local runs.'
    });
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
