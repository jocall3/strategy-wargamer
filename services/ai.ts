
import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";
import { formatCurrency } from "../utils/helpers";

export class AIService {
  private static constructPrompt(gameState: GameState, query: string): string {
    const player = gameState.playerCompany;
    const competitors = gameState.competitors;
    const lastReport = gameState.historicalReports[gameState.historicalReports.length - 1];

    return `
      You are an expert business strategy AI consultant named 'NexusOracle'.
      You are advising the CEO of "${player.name}" within a complex market simulation.
      Your tone should be insightful, witty, and brutally honest.

      CURRENT SITUATION (Year ${gameState.currentYear}):
      - Company: ${player.name}
      - Cash: ${formatCurrency(player.cash)}
      - Market Share: ${player.marketShare.toFixed(2)}%
      - Net Profit (Last Year): ${formatCurrency(player.profit)}
      - Strategic Focus: ${player.strategicFocus}
      - Brand Reputation: ${player.brandReputation.toFixed(0)}/100
      - Core Competitors: ${competitors.map(c => `${c.name} (${c.marketShare.toFixed(2)}% share, strategy: ${c.strategy})`).join(', ')}
      - Global Market Sentiment: ${gameState.globalMarketSentiment}/100

      LAST YEAR'S REPORT SUMMARY:
      - Key Insights: ${lastReport?.keyInsights.join('; ') || 'N/A'}
      - Recommendations: ${lastReport?.recommendations.join('; ') || 'N/A'}
      - Major Market Events: ${lastReport?.marketNewsEvents.join('; ') || 'N/A'}

      The CEO has the following query: "${query}"

      Your task is to provide a concise, actionable, and strategic response based on this data.
      Do not just repeat the data. Synthesize it. Provide your expert opinion as NexusOracle.
    `;
  }

  public static async getStrategicAdvice(gameState: GameState, query: string): Promise<string> {
    // API key must be obtained directly from process.env.API_KEY
    if (!process.env.API_KEY) {
      return "NexusOracle: System offline. (API Key missing. Please ensure API_KEY is set in environment.)";
    }

    try {
      // Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = this.constructPrompt(gameState, query);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      });

      // Correct: Use .text property to access content from GenerateContentResponse
      return response.text || "I'm contemplating the futility of corporate strategy. Please try again.";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return `NexusOracle: Failed to process request. Error: ${error.message}`;
    }
  }
}
