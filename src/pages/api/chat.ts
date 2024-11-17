import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const prompt = `You are a helpful but concise assistant. Keep your responses brief and to the point, usually just 1-2 sentences. Avoid philosophical tangents or excessive elaboration.\n\nUser: ${message}\nAssistant:`;
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
            max_new_tokens: 500,
            temperature: 0.7,
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
    const reply = Array.isArray(data)
      ? data[0].generated_text
      : data.generated_text;

    res.status(200).json({ message: reply.trim() });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      error: "Could not process chat message. Please try again.",
    });
  }
}
