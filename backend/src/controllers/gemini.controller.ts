import { askGroq } from "@/services/groq.service";
import { Request, Response } from "express";

const GROQ_API = process.env.GROQ_API;

export const GroqResponse = async (req: Request, res: Response) => {
  if (!GROQ_API) {
    res.status(404).json({
      success: false,
      message: "Groq API Key Not Found",
    });
    return;
  }

  const { message, context } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message must be a string." });
    return;
  }

  try {
    // Enhanced prompt with document collaboration capabilities
    let prompt = message;

    if (context?.documentContent) {
      prompt = `You are an AI assistant specialized in document collaboration and productivity. You can help with:
- Summarizing documents (brief, detailed, or executive summaries)
- Extracting key points and main ideas
- Answering questions about document content
- Improving text quality and clarity
- Creating outlines and structure
- Grammar and style suggestions
- Writing assistance and enhancement

Document Context: "${context.documentContent}"

User's Request: ${message}

Please provide a helpful, accurate, and contextual response. If the user asks for a summary, provide it in a clear format. If they ask for improvements, be specific and actionable. If they have questions, answer based on the document content.`;
    } else {
      // For general questions without document context
      prompt = `You are an AI assistant specialized in document collaboration and productivity. 

User's Request: ${message}

Please provide a helpful and accurate response. You can assist with writing, editing, summarizing, outlining, and general document-related tasks.`;
    }

    const response = await askGroq(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({
      error: "Failed to get response from Groq",
      response: "Sorry, I encountered an error. Please try again.",
    });
    return;
  }
};
