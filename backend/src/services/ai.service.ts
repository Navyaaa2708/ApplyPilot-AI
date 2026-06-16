import { AI_PROVIDER_ENDPOINT, AI_PROVIDER_MODEL } from "../config/auth.js";

const PROVIDERS = [
  { id: "ollama", name: "Ollama", type: "local" },
  { id: "together", name: "Together AI", type: "cloud" },
  { id: "vllm", name: "vLLM", type: "local" }
];

type ProviderRequest = {
  endpoint?: string;
  model: string;
  prompt: string;
  max_tokens: number;
};

export class AIService {
  static async generateCoverLetter(userId: string, payload: { company: string; role: string; resumeText: string; jobDescription: string; model?: string; }) {
    const userTag = `[user:${userId}] `;
    const prompt = `${userTag}Write a concise, ATS-friendly cover letter for ${payload.company} and role ${payload.role}. Use the resume summary and incorporate keywords from the job description. Resume text: ${payload.resumeText}. Job description: ${payload.jobDescription}.`;
    const response = await AIService.callProvider({ model: payload.model || AI_PROVIDER_MODEL, prompt, max_tokens: 600 });
    return { coverLetter: response.output || "" };
  }

  static async callProvider({ endpoint = AI_PROVIDER_ENDPOINT, model, prompt, max_tokens }: ProviderRequest): Promise<{ output: string }> {
    const url = `${endpoint}/v1/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, max_tokens, temperature: 0.2 })
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Provider request failed: ${body}`);
    }
    const data = await response.json();
    return { output: data?.output || data?.choices?.[0]?.text || "" };
  }

  static async validateLocalProvider(endpoint: string, model: string): Promise<{ isConnected: boolean; endpoint: string; model: string }> {
    const testPrompt = "Say hello from ApplyPilot AI.";
    const result = await AIService.callProvider({ endpoint, model, prompt: testPrompt, max_tokens: 20 });
    return { isConnected: Boolean(result.output), endpoint, model };
  }

  static async listProviders() {
    return PROVIDERS;
  }
}
