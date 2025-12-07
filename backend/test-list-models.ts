import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function listModels() {
    try {
        console.log('Listing models...');
        // Try to list models if the method exists
        // Based on some docs, it might be ai.models.list()
        const response = await ai.models.list();
        // @ts-ignore
        response.pageInternal.forEach((m: any) => console.log(m.name));

    } catch (error: any) {
        console.error('Error listing models:', error.message);

        // Fallback: try to guess if it's a different method
        try {
            // @ts-ignore
            const response = await ai.listModels();
            console.log('Models (fallback):', JSON.stringify(response, null, 2));
        } catch (e: any) {
            console.error('Error listing models (fallback):', e.message);
        }
    }
}

listModels();
