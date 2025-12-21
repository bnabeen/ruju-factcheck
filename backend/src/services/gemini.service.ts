import { GoogleGenAI } from '@google/genai';
import config from '../config/env';

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

export enum VerdictType {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    MISLEADING = 'MISLEADING',
    UNVERIFIED = 'UNVERIFIED',
}

export enum Language {
    EN = 'EN',
    NP = 'NP',
}

export interface AIAnalysisResult {
    verdict: VerdictType;
    confidence: number;
    summary: string;
    reasoning: string;
    sources: Array<{ title: string; uri: string }>;
}

const mapNepaliDigits = (str: string): string => {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return str
        .split('')
        .map((char) => {
            const index = nepaliDigits.indexOf(char);
            return index > -1 ? String(index) : char;
        })
        .join('');
};

export class GeminiService {
    static async verifyTextClaim(claim: string, lang: Language): Promise<AIAnalysisResult> {
        // Check if API key is configured
        if (!config.gemini.apiKey || config.gemini.apiKey.trim() === '') {
            throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
        }

        try {
            const model = 'gemini-2.5-flash';

            const languageInstruction =
                lang === Language.NP
                    ? 'CRITICAL: Respond entirely in Nepali language for the values (Summary, Reasoning, Verdict). The keys MUST remain in English. \\nFormat:\\nVerdict: [सत्य/असत्य/भ्रामक/अपुष्ट]\\nConfidence: [0-100]\\nSummary: [नेपालीमा एक वाक्यमा निष्कर्ष]\\nReasoning: [विस्तृत विश्लेषण ३-४ अनुच्छेदमा दिनुहोस्। यसमा दाबी के हो, विभिन्न समाचार स्रोतहरू (जस्तै कान्तिपुर, अनलाइनखबर आदि) ले के भनेका छन् (प्रकाशन मिति र मुख्य विवरण सहित), तथ्य जाँचको निष्कर्ष र अन्तिम निर्णय समावेश गर्नुहोस्।]'
                    : 'Respond in English. Use these exact keys:\\nVerdict: [True/False/Misleading/Unverified]\\nConfidence: [0-100]\\nSummary: [One sentence conclusion]\\nReasoning: [Provide a detailed analysis in 3-4 paragraphs. Include: 1. The Claim (what is being said), 2. What News Sources Say (cite specific examples like Kantipur, OnlineKhabar with PUBLICATION DATES and specific details), 3. Findings (what the facts are), and 4. Conclusion.]';

            const response = await ai.models.generateContent({
                model,
                contents: `Fact check this claim relative to Nepal or global context: "${claim}". 
        ${languageInstruction}`,
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: `You are RUJU, a strict, source-constrained Fact-Checking AI...`,
                    temperature: 0,
                },
            });

            const text = response.text || '';
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

            const sources = groundingChunks
                .map((chunk: any) => (chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null))
                .filter((s: any) => s !== null);

            // Parse response
            const lines = text
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.length > 0);

            let verdict = VerdictType.UNVERIFIED;
            let confidence = 0;
            let summary = '';
            let reasoning = '';
            let isReasoningSection = false;

            for (const line of lines) {
                // Remove markdown chars (*, #, -) from start of line for key checking
                const cleanLine = line.replace(/^[\*\#\-\s]+/, '');
                const lowerLine = cleanLine.toLowerCase();

                if (lowerLine.startsWith('verdict')) {
                    const val = line.split(':')[1]?.trim().toLowerCase() || '';
                    if (val.includes('असत्य') || val.includes('गलत') || val.includes('false') || val.includes('fake')) {
                        verdict = VerdictType.FALSE;
                    } else if (val.includes('भ्रामक') || val.includes('misleading')) {
                        verdict = VerdictType.MISLEADING;
                    } else if (val.includes('सत्य') || val.includes('true') || val.includes('real')) {
                        verdict = VerdictType.TRUE;
                    } else if (val.includes('अपुष्ट') || val.includes('unverified')) {
                        verdict = VerdictType.UNVERIFIED;
                    }
                    isReasoningSection = false;
                } else if (lowerLine.startsWith('confidence')) {
                    const match = line.match(/(\d+|[०-९]+)/);
                    if (match) {
                        const digits = mapNepaliDigits(match[1]);
                        confidence = parseInt(digits, 10);
                    }
                    isReasoningSection = false;
                } else if (lowerLine.startsWith('summary')) {
                    summary = line.split(':').slice(1).join(':').trim();
                    isReasoningSection = false;
                } else if (lowerLine.startsWith('reasoning')) {
                    isReasoningSection = true;
                    const content = line.split(':').slice(1).join(':').trim();
                    if (content) reasoning += content + '\n';
                } else if (isReasoningSection) {
                    reasoning += line + '\n';
                }
            }

            if (confidence === 0) confidence = 85;

            return {
                verdict,
                confidence,
                summary: summary.replace(/\*\*/g, '').trim(),
                reasoning: reasoning.trim(),
                sources: sources as any[],
            };
        } catch (error) {
            console.error('Gemini verification failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            // Provide more specific error messages
            if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
                throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file.');
            }
            if (errorMessage.includes('quota') || errorMessage.includes('429')) {
                throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
            }

            throw new Error(`Unable to verify claim: ${errorMessage}`);
        }
    }

    static async verifyImage(base64Image: string, promptContext: string, lang: Language): Promise<AIAnalysisResult> {
        // Check if API key is configured
        if (!config.gemini.apiKey || config.gemini.apiKey.trim() === '') {
            throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
        }

        try {
            const model = 'gemini-2.5-flash';

            const languageInstruction =
                lang === Language.NP
                    ? 'CRITICAL: Respond entirely in Nepali language (Devanagari script).'
                    : 'Respond in English.';

            const prompt = `You are RUJU, a Digital Forensic and Fact-Checking AI. Analyze this image for authenticity and manipulation.

User Context: ${promptContext || 'Verify the authenticity of this image.'}

${languageInstruction}

Provide a detailed analysis covering:

1. AI Generated: Check if the image shows signs of AI generation (unnatural patterns, glossy textures, distorted features, logical errors)

2. Manipulation Evidence: Look for Photoshop edits, deepfakes, cloning, color mismatches, font inconsistencies, or digital alterations

3. Content Description: Describe what the image shows (objects, people, text visible, location if identifiable)

4. Final Verdict: Conclude with one of these: Real/Authentic, Fake/Altered, Misleading, or Inconclusive

FORMATTING RULES:
- DO NOT use markdown formatting like ** or ##
- Use plain text with clear numbered sections
- Be concise and direct`;

            const response = await ai.models.generateContent({
                model,
                contents: {
                    parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Image } }, { text: prompt }],
                },
                config: {
                    temperature: 0,
                },
            });

            const text = response.text || '';

            // Remove markdown formatting
            const cleanText = text
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/#{1,6}\s/g, '')
                .replace(/`{1,3}/g, '')
                .trim();

            // Parse verdict
            let verdict = VerdictType.UNVERIFIED;
            const lowerText = cleanText.toLowerCase();

            if (
                lowerText.includes('fake') ||
                lowerText.includes('altered') ||
                lowerText.includes('manipulated') ||
                lowerText.includes('नक्कली') ||
                lowerText.includes('परिवर्तित')
            ) {
                verdict = VerdictType.FALSE;
            } else if (
                lowerText.includes('real') ||
                lowerText.includes('authentic') ||
                lowerText.includes('genuine') ||
                lowerText.includes('वास्तविक') ||
                lowerText.includes('प्रामाणिक')
            ) {
                verdict = VerdictType.TRUE;
            }

            let confidence = 85;
            const confMatch = cleanText.match(/confidence[:\s]+(\d+)/i);
            if (confMatch) {
                confidence = parseInt(confMatch[1], 10);
            }

            let summary = '';
            if (lang === Language.NP) {
                if (verdict === VerdictType.FALSE) summary = 'छवि नक्कली वा परिवर्तित देखिन्छ';
                else if (verdict === VerdictType.TRUE) summary = 'छवि वास्तविक र प्रामाणिक देखिन्छ';
                else summary = 'छवि प्रामाणिकता अनिश्चित छ';
            } else {
                if (verdict === VerdictType.FALSE) summary = 'Image appears to be fake or altered';
                else if (verdict === VerdictType.TRUE) summary = 'Image appears to be real and authentic';
                else summary = 'Image authenticity is inconclusive';
            }

            return {
                verdict,
                confidence,
                summary,
                reasoning: cleanText,
                sources: [],
            };
        } catch (error) {
            console.error('Image verification failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);

            // Provide more specific error messages
            if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
                throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file.');
            }
            if (errorMessage.includes('quota') || errorMessage.includes('429')) {
                throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
            }

            throw new Error(`Unable to analyze image: ${errorMessage}`);
        }
    }
    static async generateContent(claim: string): Promise<{
        article: {
            claim: string;
            verdict: string;
            evidence: string;
            result: string;
            sources: string[];
        };
        reelScript: string;
        infographic: string;
    }> {
        if (!config.gemini.apiKey || config.gemini.apiKey.trim() === '') {
            throw new Error('GEMINI_API_KEY is not configured.');
        }

        try {
            const model = 'gemini-2.5-flash';
            const prompt = `
            You are RUJU, an expert fact-checking AI assistant.
            Generate comprehensive content in NEPALI language for the following claim: "${claim}".

            You must generate content in 3 distinct formats.

            FORMAT 1: WEBSITE ARTICLE (Detailed Factcheck)
            - Language: Nepali
            - Structure:
              1. Claim (दाबी): Clearly state the claim.
              2. Verdict (निष्कर्ष): True, False, Misleading, etc.
              3. Evidence (प्रमाण): Detailed evidence gathering (500-800 words). Cite sources.
              4. Result (नतिजा): Final conclusion based on evidence.
              5. Sources (स्रोतहरू): List of real URLs found via Google Search.

            FORMAT 2: REEL SCRIPT (Short Video)
            - Language: Nepali
            - Duration: 50-60 seconds
            - Style: Engaging, fast-paced, clear.
            - Include: Hook, Body, Conclusion, Call to Action.
            - Add: Caption and Hashtags.

            FORMAT 3: INFOGRAPHIC TEXT
            - Language: Nepali
            - Style: Concise, bullet points, visual-ready text.
            - Key points only.

            OUTPUT FORMAT (JSON ONLY - NO MARKDOWN, NO CODE BLOCKS):
            Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations before or after.
            {
                "article": {
                    "claim": "...",
                    "verdict": "...",
                    "evidence": "...",
                    "result": "...",
                    "sources": ["url1", "url2"]
                },
                "reelScript": "...",
                "infographic": "..."
            }
            `;

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.2,
                },
            });

            let text = response.text || '{}';

            // Clean up markdown code blocks and any surrounding text
            text = text
                .replace(/```json\n?/gi, '')  // Remove opening json code block
                .replace(/```\n?/g, '')       // Remove closing code blocks
                .replace(/^[^{]*/, '')         // Remove any text before first {
                .replace(/[^}]*$/, '')        // Remove any text after last }
                .trim();

            // Try to extract JSON if it's embedded in text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }

            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw AI Response:', response.text);
                console.error('Cleaned text:', text);
                throw new Error('Failed to parse AI response. The AI might have returned invalid JSON. Check backend logs for details.');
            }

        } catch (error) {
            console.error('Content generation failed:', error);
            
            // Log full error details for debugging
            if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            } else {
                console.error('Error object:', JSON.stringify(error, null, 2));
            }

            // Check for specific error types
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorString = JSON.stringify(error).toLowerCase();

            // Check for quota/resource exhausted errors (more comprehensive check)
            if (
                errorMessage.includes('429') || 
                errorMessage.includes('quota') || 
                errorMessage.includes('RESOURCE_EXHAUSTED') ||
                errorMessage.includes('resource_exhausted') ||
                errorString.includes('quota') ||
                errorString.includes('429') ||
                errorString.includes('resource_exhausted')
            ) {
                throw new Error('Gemini API quota exceeded. Please check your API usage limits or try again later.');
            }

            // Check for authentication errors
            if (
                errorMessage.includes('401') || 
                errorMessage.includes('403') || 
                errorMessage.includes('API key') ||
                errorMessage.includes('unauthorized') ||
                errorMessage.includes('forbidden') ||
                errorString.includes('401') ||
                errorString.includes('403')
            ) {
                throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.');
            }

            // Check for model not found errors
            if (
                errorMessage.includes('not found') ||
                errorMessage.includes('404') ||
                errorMessage.includes('model') && errorMessage.includes('invalid') ||
                errorString.includes('not found') ||
                errorString.includes('404')
            ) {
                throw new Error('Gemini model not found. Please check the model name in the code.');
            }

            throw new Error('Failed to generate content: ' + errorMessage);
        }
    }
}
