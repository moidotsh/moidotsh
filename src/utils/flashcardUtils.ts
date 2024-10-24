// flashcardUtils.ts

import { Flashcard } from "@/assets/flashcards/flashcardTypes";

// Helper function to shuffle the flashcards array
export const shuffleArray = (array: Flashcard[]): Flashcard[] => {
  const allowedFirstCards = array.filter((card) => !card.neverDisplayFirst);
  const firstCard =
    allowedFirstCards.length > 0
      ? allowedFirstCards[Math.floor(Math.random() * allowedFirstCards.length)]
      : array[0];

  const restCards = array
    .filter((card) => card.id !== firstCard.id)
    .sort(() => Math.random() - 0.5);

  return [firstCard, ...restCards];
};

// Helper function to get flashcards based on selected category and folders
export const getSelectedFlashcards = (
  selectedCategory: string,
  selectedFolders: string[],
  flashcardCategories: any,
): Flashcard[] => {
  let selectedFlashcards: Flashcard[] = [];

  if (selectedCategory === "Math") {
    selectedFlashcards = selectedFolders.flatMap(
      (folderName) => flashcardCategories.Math?.[folderName] || [],
    );
  } else if (selectedCategory === "Computer Science") {
    selectedFlashcards = selectedFolders.flatMap(
      (folderName) =>
        flashcardCategories["Computer Science"]?.[folderName] || [],
    );
  }
  return selectedFlashcards;
};
