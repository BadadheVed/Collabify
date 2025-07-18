import { GoogleGenerativeAI } from "@google/generative-ai";
import { response } from "express";
const GEMINI_API = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(GEMINI_API || "");
export const askGemini = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};
