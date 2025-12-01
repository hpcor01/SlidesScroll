import { GoogleGenAI, Type } from "@google/genai";
import { Article, DuplicateCheckResult } from "../types";

// Initialize Gemini Client
// Note: In a real production app, ensure API_KEY is strictly handled.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const checkDuplicateWithGemini = async (
  newSubject: string,
  newText: string,
  existingArticles: Article[]
): Promise<DuplicateCheckResult> => {
  
  if (existingArticles.length === 0) {
    return { isDuplicate: false };
  }

  // Optimize: Check exact string matches locally first to save API calls
  const exactMatch = existingArticles.find(
    a => a.subject.toLowerCase() === newSubject.toLowerCase() && a.text.toLowerCase() === newText.toLowerCase()
  );

  if (exactMatch) {
    return { 
      isDuplicate: true, 
      originalId: exactMatch.id, 
      similarArticleAuthor: exactMatch.authorName,
      reason: "Correspondência exata encontrada." 
    };
  }

  // AI Semantic Check
  const contextData = existingArticles.map(a => ({
    id: a.id,
    subject: a.subject,
    text: a.text.substring(0, 500) // Truncate to save tokens
  }));

  const prompt = `
    Analise se o NOVO ARTIGO é uma duplicata semântica de algum dos ARTIGOS EXISTENTES.
    Considere "duplicata" se o assunto e o contexto principal forem > 75% similares.
    
    Se encontrar duplicata, retorne o ID do artigo existente no campo 'similarArticleId'.
    
    NOVO ARTIGO:
    Assunto: ${newSubject}
    Texto: ${newText}

    ARTIGOS EXISTENTES:
    ${JSON.stringify(contextData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isDuplicate: { type: Type.BOOLEAN },
            similarArticleId: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["isDuplicate"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Critical: Retrieve the author name locally based on the returned ID
    let authorName: string | undefined = undefined;
    
    if (result.isDuplicate && result.similarArticleId) {
        const found = existingArticles.find(a => a.id === result.similarArticleId);
        if (found) {
            authorName = found.authorName;
        } else {
            // Fallback strategy: if ID is hallucinated but isDuplicate is true, try to match by partial text or warn anyway
            console.warn("ID retornado pelo Gemini não encontrado localmente.");
        }
    }

    return {
      isDuplicate: result.isDuplicate,
      originalId: result.similarArticleId,
      similarArticleAuthor: authorName,
      reason: result.explanation
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { isDuplicate: false }; 
  }
};
