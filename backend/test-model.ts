import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function listModels() {
    try {
        console.log('Listing models...');

        const model = 'gemini-pro';
        console.log(`Testing model: ${model}`);

        const response = await ai.models.generateContent({
            model: model,
            contents: 'Hello',
        });
        console.log('Success with gemini-pro:', response.text);

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

listModels();
