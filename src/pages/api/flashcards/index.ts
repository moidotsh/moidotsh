// src/pages/api/flashcards/index.ts

import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { FlashcardWithPath } from "@/utils/flashcardUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlashcardWithPath[] | { error: string }>,
) {
  console.log("API request received:", req.query);

  const { category, folders } = req.query;

  if (!category || !folders) {
    console.log("Missing required parameters:", { category, folders });
    return res.status(400).json({ error: "Missing category or folders" });
  }

  try {
    // Parse the chapter.unit identifiers
    const folderSelections = Array.isArray(folders)
      ? folders
      : folders.split(",");

    console.log("Processing folder selections:", folderSelections);

    // Extract chapter and unit numbers
    const unitSelections = folderSelections.map((folder) => {
      const [chapter, unit] = folder.split(".").map(Number);
      return { chapter, unit };
    });

    console.log("Parsed unit selections:", unitSelections);

    // Build conditions for the query
    const conditions = unitSelections.map(
      ({ chapter, unit }) =>
        `(chapter_number.eq.${chapter} and unit_number.eq.${unit})`,
    );

    console.log("Building query with conditions:", conditions);

    // Build the query
    let query = supabase
      .from("flashcard_paths")
      .select("*")
      .eq("category_name", category.toString().toLowerCase());

    if (conditions.length > 0) {
      query = query.or(conditions.join(","));
    }

    const { data, error } = await query;

    console.log("Query response:", {
      success: !error,
      totalCards: data?.length ?? 0,
      uniqueUnits: data
        ? [
            ...new Set(
              data.map((card) => `${card.chapter_number}.${card.unit_number}`),
            ),
          ]
        : [],
      error: error?.message,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No flashcards found" });
    }

    // Verify card units match request
    const filteredData = data.filter((card) => {
      const isValid = unitSelections.some(
        (sel) =>
          sel.chapter === card.chapter_number && sel.unit === card.unit_number,
      );
      if (!isValid) {
        console.warn("Filtering out card from wrong unit:", {
          cardId: card.id,
          chapter: card.chapter_number,
          unit: card.unit_number,
        });
      }
      return isValid;
    });

    console.log("Final response:", {
      originalCount: data.length,
      filteredCount: filteredData.length,
      units: [
        ...new Set(
          filteredData.map(
            (card) => `${card.chapter_number}.${card.unit_number}`,
          ),
        ),
      ],
    });

    return res.status(200).json(filteredData);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to load flashcards" });
  }
}
