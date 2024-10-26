// src/utils/flashcardUtils.ts
import { Flashcard } from "@/assets/flashcards/flashcardTypes";

export const fetchFlashcardsFromAPI = async (
  selectedCategory: string,
  selectedFolders: string[],
): Promise<Flashcard[]> => {
  console.log("Fetching flashcards for: ", {
    category: selectedCategory,
    folders: selectedFolders,
  });

  try {
    const queryString = new URLSearchParams({
      category: selectedCategory,
      folders: selectedFolders.join(","),
    }).toString();

    const response = await fetch(`/api/flashcards?${queryString}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch flashcards");
    }

    const flashcards = await response.json();
    console.log(`Received ${flashcards.length} flashcards from API`);
    return flashcards;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw error;
  }
};
