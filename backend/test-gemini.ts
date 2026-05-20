// Quick test script to verify Gemini API
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        console.log('API Key present:', !!process.env.GEMINI_API_KEY);

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: 'Say hello in JSON format with a "message" field',
            config: {
                responseMimeType: 'application/json',
                temperature: 0.2,
            },
        });

        console.log('Success! Response:', response.text);
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
}

testGemini();
