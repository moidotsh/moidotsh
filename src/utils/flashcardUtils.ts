// src/utils/flashcardUtils.ts
import { supabase } from "@/lib/supabase";

export const fetchFlashcardsFromAPI = async (
  category: string,
  folders: string[],
): Promise<FlashcardWithPath[]> => {
  try {
    console.log("Starting fetchFlashcardsFromAPI:", { category, folders });

    // Convert category to lowercase to match database
    const categoryName = category.toLowerCase();

    // Parse the chapter numbers from folders
    const chapterNumbers = folders
      .map((folder) => {
        const number = parseInt(folder);
        return number;
      })
      .filter((num) => !isNaN(num));

    console.log("Query parameters:", {
      categoryName,
      chapterNumbers,
    });

    // Query using the flashcard_paths view
    const { data, error } = await supabase
      .from("flashcard_paths")
      .select("*")
      .eq("category_name", categoryName)
      .in("chapter_number", chapterNumbers);

    console.log("Query result:", {
      hasData: Boolean(data),
      dataLength: data?.length ?? 0,
      error: error?.message ?? "none",
      sampleData: data?.[0],
    });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error in fetchFlashcardsFromAPI:", error);
    throw error;
  }
};

// Add a helper function to get the available chapters for each subcategory
export const getChapterNumbersForSubcategory = (
  subcategory: string,
): number[] => {
  switch (subcategory) {
    case "Pre-Calculus":
      return [4, 5, 6]; // Update these numbers based on your actual chapters
    case "Calculus 1":
      return [1, 2, 3]; // Update these numbers based on your actual chapters
    default:
      return [];
  }
};

export const testFlashcardQuery = async () => {
  try {
    const { data, error } = await supabase
      .from("flashcard_paths")
      .select("*")
      .limit(1);

    console.log("Test query result:", {
      success: !error,
      hasData: Boolean(data),
      error: error?.message,
      firstRecord: data?.[0],
    });

    return !error && data && data.length > 0;
  } catch (error) {
    console.error("Test query failed:", error);
    return false;
  }
};

// Add this helper function to check if the database is accessible
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("flashcard_paths")
      .select("count")
      .single();

    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }

    console.log("Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Supabase connection test error:", error);
    return false;
  }
};

// Add a test function to check the database directly
export const testDatabaseContent = async () => {
  const { data: categories } = await supabase.from("categories").select("*");

  const { data: chapters } = await supabase.from("chapters").select("*");

  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("*")
    .limit(5);

  console.log("Database content:", {
    categories,
    chapters,
    sampleFlashcards: flashcards,
  });

  return {
    categories,
    chapters,
    sampleFlashcards: flashcards,
  };
};
