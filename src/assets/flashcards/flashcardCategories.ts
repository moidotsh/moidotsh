// src/assets/flashcards/flashcardCategories.ts

export type Category = "Math"; // Add as needed with |

export type FlashcardSubcategories = {
  [key: string]: string;
};

export type FlashcardCategories = {
  [K in Category]: FlashcardSubcategories;
};

export const flashcardCategories: FlashcardCategories = {
  Math: {
    "Pre-Calculus": "precalc",
    // Algebra: "algebra",
    // "Calculus 1": "calc1",
  },
} as const;
