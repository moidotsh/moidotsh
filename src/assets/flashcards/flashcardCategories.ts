// flashcardCategories.ts

import { algebraFlashcards } from "./algebraFlashcards";
import { precalculusFlashcards } from "./precalculusFlashcards";
import { calculusFlashcards } from "./calculusFlashcards";
import { dataStructuresFlashcards } from "./datastructuresFlashcards";
import { algorithmsFlashcards } from "./algorithmsFlashcards";
import { Flashcard } from "./flashcardTypes";

// Define the structure for Math and Computer Science categories
export type MathCategory = {
  Algebra: Flashcard[];
  "Pre-Calculus": Flashcard[];
  "Calculus 1": Flashcard[];
};

export type ComputerScienceCategory = {
  "Data Structures": Flashcard[];
  Algorithms: Flashcard[];
};

// Export the flashcard categories and types
export const flashcardCategories: {
  Math: MathCategory;
  "Computer Science": ComputerScienceCategory;
} = {
  Math: {
    Algebra: algebraFlashcards,
    "Pre-Calculus": precalculusFlashcards,
    "Calculus 1": calculusFlashcards,
  },
  "Computer Science": {
    "Data Structures": dataStructuresFlashcards,
    Algorithms: algorithmsFlashcards,
  },
};
