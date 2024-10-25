type FlashcardCategories = {
  Math: {
    Algebra: string;
    "Pre-Calculus": string;
    "Calculus 1": string;
  };
  "Computer Science": {
    "Data Structures": string;
    Algorithms: string;
  };
};

export const flashcardCategories: FlashcardCategories = {
  Math: {
    Algebra: "algebra",
    "Pre-Calculus": "precalc",
    "Calculus 1": "calc1",
  },
  "Computer Science": {
    "Data Structures": "data-structures",
    Algorithms: "algorithms",
  },
};
