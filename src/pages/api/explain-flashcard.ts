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

const formatPrompt = (
  question: string,
  answer: string,
  selectedAnswer: string | null,
) => {
  const isCorrect = selectedAnswer === answer;

  return `As a mathematics tutor, explain the following concept:

Question: ${question}
${
  selectedAnswer
    ? `Student's Answer: ${selectedAnswer}
Correct Answer: ${answer}
This answer was ${isCorrect ? "correct" : "incorrect"}.`
    : `Answer: ${answer}`
}

Provide a clear explanation of why this is the correct answer, using LaTeX notation where appropriate.
If the student's answer was incorrect, explain what went wrong.

Write your response in a structured way using bullet points where helpful.
Use LaTeX notation with \\( \\) for inline math and \\[ \\] for display math.`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
  if (!HUGGING_FACE_API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const { question, answer, selectedAnswer } = req.body as RequestBody;

    // Format the prompt
    const prompt = formatPrompt(question, answer, selectedAnswer);

    // Call Hugging Face API
    // Using Mixtral by default as it's good with math and LaTeX
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Format the response
    let explanation = Array.isArray(data)
      ? data[0].generated_text
      : data.generated_text;

    // Clean up the response
    explanation = explanation
      .trim()
      // Ensure proper LaTeX formatting
      .replace(/\$\$(.*?)\$\$/g, "\\[$1\\]")
      .replace(/\$(.*?)\$/g, "\\($1\\)")
      // Add line breaks for bullet points if they don't exist
      .replace(/•/g, "\n•");

    // Add formatting for better readability
    explanation = `Let's understand this step by step:

1. The question asks: ${question}

${
  selectedAnswer
    ? `2. You selected: ${selectedAnswer}

3. The correct answer is: ${answer}

4. `
    : "2. "
}${explanation}`;

    res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error in explain-flashcard:", error);
    let errorMessage = "Failed to generate explanation";

    if (error instanceof Error) {
      // Model might be loading
      if (error.message.includes("loading")) {
        errorMessage =
          "The explanation model is warming up. Please try again in a few seconds.";
      }
    }

    res.status(500).json({ error: errorMessage });
  }
}
