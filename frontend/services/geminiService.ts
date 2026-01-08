export type { AIAnalysisResult } from '../types';
import { AIAnalysisResult, VerdictType, Language } from '../types';

/**
 * Call backend verify endpoint instead of using Gemini in the browser.
 * Maps backend uppercase verdicts (e.g. 'TRUE') -> frontend enum [`types.VerdictType`](types.ts)
 */
const mapVerdict = (v: string): VerdictType => {
  switch ((v || '').toUpperCase()) {
    case 'TRUE':
      return VerdictType.TRUE;
    case 'FALSE':
      return VerdictType.FALSE;
    case 'MISLEADING':
      return VerdictType.MISLEADING;
    default:
      return VerdictType.UNVERIFIED;
  }
};

export const verifyTextClaim = async (claim: string, lang: Language = Language.EN): Promise<AIAnalysisResult> => {
  try {
    const res = await fetch('/api/verify/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim, lang }),
    });

    if (!res.ok) {
      let errorMessage = `Server error: ${res.status}`;
      try {
        const errorData = await res.json();
        // Check both 'error' and 'message' fields
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        try {
          const text = await res.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          // Use default error message
        }
      }

      // Provide more helpful error messages
      if (res.status === 503 || res.status === 0) {
        throw new Error('Backend server is not running. Please start the backend server on port 5001.');
      }
      if (errorMessage.includes('API key') || errorMessage.includes('GEMINI') || errorMessage.includes('not configured')) {
        throw new Error('Gemini API key is missing or invalid. Please check your backend .env file.');
      }
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();

    // Normalize backend response to frontend AIAnalysisResult shape
    return {
      verdict: mapVerdict(data.verdict),
      confidence: Number(data.confidence ?? 0),
      summary: data.summary ?? '',
      reasoning: data.reasoning ?? '',
      sources: Array.isArray(data.sources) ? data.sources : [],
    } as AIAnalysisResult;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the backend is running on port 5001.');
    }
    throw err;
  }
};

export const verifyImage = async (base64Image: string, context: string = '', lang: Language = Language.EN): Promise<AIAnalysisResult> => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const res = await fetch('/api/verify/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, context, lang }),
    });

    if (!res.ok) {
      let errorMessage = `Server error: ${res.status}`;
      try {
        const errorData = await res.json();
        // Check both 'error' and 'message' fields
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        try {
          const text = await res.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          // Use default error message
        }
      }

      // Provide more helpful error messages
      if (res.status === 503 || res.status === 0) {
        throw new Error('Backend server is not running. Please start the backend server on port 5001.');
      }
      if (errorMessage.includes('API key') || errorMessage.includes('GEMINI') || errorMessage.includes('not configured')) {
        throw new Error('Gemini API key is missing or invalid. Please check your backend .env file.');
      }
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();

    // Normalize backend response to frontend AIAnalysisResult shape
    return {
      verdict: mapVerdict(data.verdict),
      confidence: Number(data.confidence ?? 0),
      summary: data.summary ?? '',
      reasoning: data.reasoning ?? '',
      sources: Array.isArray(data.sources) ? data.sources : [],
    } as AIAnalysisResult;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the backend is running on port 5001.');
    }
    throw err;
  }
};