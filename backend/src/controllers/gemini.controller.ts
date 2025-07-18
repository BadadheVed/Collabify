import { GoogleGenerativeAI } from "@google/generative-ai";
import { askGemini } from "@/services/gemini.service";
import { Request, Response } from "express";

const GEMINI_API = process.env.GEMINI_API;



export const GeminiResponse = async (req: Request, res: Response) => {
  if (!GEMINI_API) {
    res.status(404).json({
      success: false,
      message: "Gemini Key Not Found",
    });
    return;
  }

  const { message, context } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message must be a string." });
    return;
  }

  try {
    // Create a comprehensive prompt using the message and context
    let prompt = message;

    if (context?.documentContent) {
      prompt = `Context: The user is working on a document with the following content:
"${context.documentContent}"

User's question: ${message}

Please provide a helpful response based on the document context and the user's question.`;
    }

    const response = await askGemini(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
    return;
  }
};
