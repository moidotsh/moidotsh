// flashcardStore.ts
import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { shuffleArray } from "@/utils/flashcardUtils";

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

  startFlashcards: async (
    category: string | null = null,
    folders: string[] = [],
  ) => {
    try {
      console.log("Starting flashcards...");

      // Fetch flashcards from API or use hardcoded defaults in the API
      const selectedFlashcards = await loadFlashcardsFromAPI();

      // Shuffle and set the flashcards
      const shuffledFlashcards = shuffleArray(selectedFlashcards);

      set({
        flashcards: shuffledFlashcards,
        index: 0,
        completedFlashcards: [],
        correctAnswers: 0,
        incorrectAnswers: 0,
        totalQuestions: shuffledFlashcards.length,
      });
    } catch (error) {
      console.error("Error starting flashcards:", error);
    }
  },
}));
