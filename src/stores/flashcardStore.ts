// flashcardStore.ts
import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";

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

type FlashcardState = {
  flashcards: Flashcard[];
  index: number;
  isFlipped: boolean;
  completedFlashcards: string[];
  correctAnswers: number;
  incorrectAnswers: number;
  selectedCategory: string | null;
  selectedFolders: string[];
  totalQuestions: number;

  // Actions
  setFlashcards: (flashcards: Flashcard[]) => void;
  nextFlashcard: (nextQuestionId?: string) => void;
  previousFlashcard: () => void;
  flipFlashcard: () => void;
  markCorrect: () => void;
  markIncorrect: () => void;
  resetProgress: () => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedFolders: (folders: string[]) => void;
  toggleFolderSelection: (folderName: string) => void;
  startFlashcards: () => Promise<void>;
};

const loadFlashcardsFromAPI = async (): Promise<Flashcard[]> => {
  try {
    console.log("Fetching flashcards from API...");
    const response = await fetch("/api/flashcards");

    if (!response.ok) {
      console.error("Failed to fetch flashcards. Status:", response.status);
      throw new Error(`Failed to fetch flashcards. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched flashcards:", data);
    return data;
  } catch (error) {
    console.error("Error in loadFlashcardsFromAPI:", error);
    throw error;
  }
};

export const useFlashcardStore = create<FlashcardState>((set) => ({
  flashcards: [],
  index: 0,
  isFlipped: false,
  completedFlashcards: [],
  correctAnswers: 0,
  incorrectAnswers: 0,
  selectedCategory: null,
  selectedFolders: [],
  totalQuestions: 0,

  setFlashcards: (flashcards: Flashcard[]) =>
    set({ flashcards, index: 0, completedFlashcards: [] }),

  nextFlashcard: (nextQuestionId?: string) =>
    set((state) => {
      let nextIndex;

      if (nextQuestionId) {
        nextIndex = state.flashcards.findIndex(
          (card) => card.id === nextQuestionId,
        );
      } else {
        const currentCard = state.flashcards[state.index];
        if (currentCard.nextQuestionId) {
          nextIndex = state.flashcards.findIndex(
            (card) => card.id === currentCard.nextQuestionId,
          );
        } else {
          nextIndex = state.index + 1;
        }
      }

      if (nextIndex === -1 || nextIndex === undefined) {
        nextIndex = state.index + 1;
      }

      while (
        nextIndex < state.flashcards.length &&
        state.completedFlashcards.includes(state.flashcards[nextIndex].id)
      ) {
        nextIndex++;
      }

      if (nextIndex >= state.flashcards.length) {
        return { index: -1, isFlipped: false };
      }

      return { index: nextIndex, isFlipped: false };
    }),

  previousFlashcard: () =>
    set((state) => {
      let prevIndex = state.index - 1;

      while (
        prevIndex >= 0 &&
        (state.completedFlashcards.includes(state.flashcards[prevIndex].id) ||
          state.flashcards[prevIndex].neverDisplayFirst)
      ) {
        prevIndex--;
      }

      return { index: Math.max(0, prevIndex), isFlipped: false };
    }),

  flipFlashcard: () => set((state) => ({ isFlipped: !state.isFlipped })),

  markCorrect: () =>
    set((state) => ({
      correctAnswers: state.correctAnswers + 1,
      completedFlashcards: [
        ...state.completedFlashcards,
        state.flashcards[state.index].id,
      ],
    })),

  markIncorrect: () =>
    set((state) => ({
      incorrectAnswers: state.incorrectAnswers + 1,
      completedFlashcards: [
        ...state.completedFlashcards,
        state.flashcards[state.index].id,
      ],
    })),

  resetProgress: () =>
    set({
      index: 0,
      isFlipped: false,
      completedFlashcards: [],
      correctAnswers: 0,
      incorrectAnswers: 0,
    }),

  setSelectedCategory: (category: string | null) =>
    set({ selectedCategory: category }),

  setSelectedFolders: (folders: string[]) => set({ selectedFolders: folders }),

  toggleFolderSelection: (folderName: string) =>
    set((state) => ({
      selectedFolders: state.selectedFolders.includes(folderName)
        ? state.selectedFolders.filter((f) => f !== folderName)
        : [...state.selectedFolders, folderName],
    })),

  startFlashcards: async () => {
    try {
      const selectedCategory = useFlashcardStore.getState().selectedCategory;
      const selectedFolders = useFlashcardStore.getState().selectedFolders;

      if (selectedCategory && selectedFolders.length > 0) {
        const folderPaths = selectedFolders.map((folder) =>
          flashcardCategories[selectedCategory][
            folder as keyof (typeof flashcardCategories)[selectedCategory]
          ]
            ? flashcardCategories[selectedCategory][
                folder as keyof (typeof flashcardCategories)[selectedCategory]
              ]
            : folder,
        );

        console.log("Starting flashcards for category:", selectedCategory);
        console.log("With folders:", folderPaths);

        const flashcards = await fetchFlashcardsFromAPI(
          selectedCategory,
          folderPaths,
        );
        useFlashcardStore.getState().setFlashcards(flashcards);
      } else {
        console.error("Please select a category and folders.");
      }
    } catch (error) {
      console.error("Error starting flashcards:", error);
    }
  },
}));
