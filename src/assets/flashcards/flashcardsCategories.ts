import { algebraFlashcards } from "./algebraFlashcards";
import { precalculusFlashcards } from "./precalculusFlashcards";
import { calculusFlashcards } from "./calculusFlashcards";
import { dataStructuresFlashcards } from "./datastructuresFlashcards";
import { algorithmsFlashcards } from "./algorithmsFlashcards";

export const flashcardCategories = {
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
