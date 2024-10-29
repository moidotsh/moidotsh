// src/pages/api/explain-flashcard.ts
import type { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  question: string;
  answer: string;
  selectedAnswer: string | null;
};

type ResponseData = {
  explanation: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, answer, selectedAnswer } = req.body as RequestBody;

    const prompt = `As a mathematics tutor, explain this concept:

Question: ${question}
${
  selectedAnswer
    ? `Student Answer: ${selectedAnswer}
Correct Answer: ${answer}`
    : `Answer: ${answer}`
}

Explain why this is correct, using LaTeX math notation where appropriate.
Keep explanations clear and complete.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500, // Increased from 200
            temperature: 0.3,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    let explanation = Array.isArray(data)
      ? data[0].generated_text
      : data.generated_text;

    // Format the explanation with proper structure
    explanation = `Let's understand this step by step:

1. The question asks: ${question}

${
  selectedAnswer
    ? `2. You selected: ${selectedAnswer}

3. The correct answer is: ${answer}

4. `
    : "2. The answer is: ${answer}\n\n3. "
}${explanation.trim()}`;

    res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error in explain-flashcard:", error);
    res.status(500).json({
      error: "Could not generate explanation. Please try again.",
    });
  }
}
