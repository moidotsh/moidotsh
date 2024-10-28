// src/utils/flashcardUtils.ts

import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

// Define the FlashcardWithPath type based on your database schema
export type FlashcardWithPath = {
  id: string;
  front: string;
  back?: string | null;
  options?: string[] | null;
  next_question_id?: string | null;
  step_number?: number | null;
  total_steps?: number | null;
  never_display_first?: boolean;
  source_file?: string | null;
  source_path?: string | null;

  // Path-related fields from the view
  lesson_id: string;
  lesson_name: string;
  unit_id: string;
  unit_number: number;
  chapter_id: string;
  chapter_number: number;
  subcategory_id: string;
  subcategory_name: string;
  category_id: string;
  category_name: string;
  created_at?: string;
  user_id?: string | null;
};

export const fetchFlashcardsFromAPI = async (
  category: string,
  folders: string[],
): Promise<FlashcardWithPath[]> => {
  try {
    console.log("Starting fetchFlashcardsFromAPI:", { category, folders });

    // Convert category to lowercase to match database
    const categoryName = category.toLowerCase();

    // Parse the chapter.unit format
    const unitSelections = folders.map((folder) => {
      const [chapter, unit] = folder.split(".");
      console.log("Parsed folder selection:", { folder, chapter, unit });
      return {
        chapter: parseInt(chapter),
        unit: parseInt(unit),
      };
    });

    console.log("Unit selections:", unitSelections);

    // Start with base query
    let query = supabase
      .from("flashcard_paths")
      .select("*")
      .eq("category_name", categoryName);

    // Add the first unit condition
    if (unitSelections.length > 0) {
      query = query
        .eq("chapter_number", unitSelections[0].chapter)
        .eq("unit_number", unitSelections[0].unit);
    }

    // Add additional unit conditions with or()
    for (let i = 1; i < unitSelections.length; i++) {
      const { chapter, unit } = unitSelections[i];
      query = query.or(`chapter_number.eq.${chapter},unit_number.eq.${unit}`);
    }

    console.log("Executing query for units:", unitSelections);

    const { data, error } = await query;

    console.log("Query response:", {
      hasData: Boolean(data),
      dataLength: data?.length ?? 0,
      error: error?.message ?? "none",
      queriedUnits: unitSelections,
      returnedUnits: data?.map((card) => ({
        chapter: card.chapter_number,
        unit: card.unit_number,
      })),
    });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Double-check that all cards belong to requested units
    const filteredData = data.filter((card) => {
      const isInRequestedUnit = unitSelections.some(
        (sel) =>
          sel.chapter === card.chapter_number && sel.unit === card.unit_number,
      );
      if (!isInRequestedUnit) {
        console.warn("Found card from unexpected unit:", {
          cardId: card.id,
          chapter: card.chapter_number,
          unit: card.unit_number,
          requestedUnits: unitSelections,
        });
      }
      return isInRequestedUnit;
    });

    console.log("After filtering:", {
      originalCount: data.length,
      filteredCount: filteredData.length,
      requestedUnits: unitSelections,
      returnedUnits: [
        ...new Set(
          filteredData.map(
            (card) => `${card.chapter_number}.${card.unit_number}`,
          ),
        ),
      ],
    });

    return filteredData as FlashcardWithPath[];
  } catch (error) {
    console.error("Error in fetchFlashcardsFromAPI:", error);
    throw error;
  }
};
