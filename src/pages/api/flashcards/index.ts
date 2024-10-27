// src/pages/api/flashcards/index.ts
import { supabase } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { FlashcardWithPath } from "@/utils/flashcardUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlashcardWithPath[] | { error: string }>,
) {
  const { category, folders } = req.query;

  if (!category || !folders) {
    return res.status(400).json({ error: "Missing category or folders" });
  }

  try {
    const folderNumbers = Array.isArray(folders) ? folders : folders.split(",");

    const validFolders = folderNumbers
      .map((folder) => parseInt(folder))
      .filter((num) => !isNaN(num));

    if (validFolders.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid folder numbers provided" });
    }

    const { data, error } = await supabase
      .from("flashcard_paths")
      .select("*")
      .eq("category_name", category.toString().toLowerCase())
      .in("chapter_number", validFolders);

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "No flashcards found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to load flashcards" });
  }
}
