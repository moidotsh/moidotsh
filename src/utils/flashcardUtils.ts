// flashcardUtils.ts

import { Flashcard } from "@/assets/flashcards/flashcardTypes";

// Function to fetch flashcards from the API based on the selected category and folders
export const fetchFlashcardsFromAPI = async (
  selectedCategory: string,
  selectedFolders: string[],
): Promise<Flashcard[]> => {
  console.log("Fetching flashcards for: ", {
    category: selectedCategory,
    folders: selectedFolders,
  });

  const response = await fetch(
    `/api/flashcards?category=${encodeURIComponent(
      selectedCategory,
    )}&folders=${encodeURIComponent(selectedFolders.join(","))}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch flashcards.");
  }

  const flashcards = await response.json();
  return flashcards;
};
