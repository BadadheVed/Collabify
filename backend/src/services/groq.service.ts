import Groq from "groq-sdk";

const GROQ_API = process.env.GROQ_API;

// Debug: Check if API key is loaded (remove this after testing)
// console.log(
//   "GROQ_API_KEY loaded:",
//   GROQ_API ? "Yes (length: " + GROQ_API.length + ")" : "No"
// );

const groq = new Groq({
  apiKey: GROQ_API || "",
});

export const askGroq = async (prompt: string): Promise<string> => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile", // Fast and capable model
    temperature: 0.3,
    max_tokens: 1024,
  });

  return (
    completion.choices[0]?.message?.content || "Unable to generate response"
  );
};
