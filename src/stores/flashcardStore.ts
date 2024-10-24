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

// Dynamically load flashcards from a hardcoded folder using import.meta.glob
const loadFlashcardsFromFolder = async (): Promise<Flashcard[]> => {
  // Hardcoded path for now
  const modules = import.meta.glob("@/assets/flashcards/data/math/4/1/*.ts");

  const flashcards: Flashcard[] = [];

  // Iterate through each module and extract flashcards
  for (const path in modules) {
    const module = await modules[path](); // Dynamically import each module
    flashcards.push(...module.default); // Assuming each module exports flashcards array as the default export
  }

  return flashcards;
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

  // Set a new deck of flashcards
  setFlashcards: (flashcards: Flashcard[]) =>
    set({ flashcards, index: 0, completedFlashcards: [] }),

  nextFlashcard: (nextQuestionId?: string) =>
    set((state) => {
      let nextIndex;

      // Prioritize using the nextQuestionId if it's provided
      if (nextQuestionId) {
        nextIndex = state.flashcards.findIndex(
          (card) => card.id === nextQuestionId,
        );
      } else {
        // Otherwise, check if the current card has a nextQuestionId
        const currentCard = state.flashcards[state.index];
        if (currentCard.nextQuestionId) {
          nextIndex = state.flashcards.findIndex(
            (card) => card.id === currentCard.nextQuestionId,
          );
        } else {
          // Fallback to incrementing normally if no chain exists
          nextIndex = state.index + 1;
        }
      }

      // Handle invalid or out-of-bound nextIndex
      if (nextIndex === -1 || nextIndex === undefined) {
        nextIndex = state.index + 1;
      }

      // Loop to skip completed flashcards but NOT chained flashcards (steps)
      while (
        nextIndex < state.flashcards.length &&
        state.completedFlashcards.includes(state.flashcards[nextIndex].id)
      ) {
        nextIndex++;
      }

      // If all cards are completed or we reach the end
      if (nextIndex >= state.flashcards.length) {
        return { index: -1, isFlipped: false }; // Mark completion
      }

      // Set the next flashcard in the sequence
      return { index: nextIndex, isFlipped: false };
    }),

  previousFlashcard: () =>
    set((state) => {
      let prevIndex = state.index - 1;

      // Loop to skip completed flashcards and those with `neverDisplayFirst`
      while (
        prevIndex >= 0 &&
        (state.completedFlashcards.includes(state.flashcards[prevIndex].id) ||
          state.flashcards[prevIndex].neverDisplayFirst)
      ) {
        prevIndex--;
      }

      return { index: Math.max(0, prevIndex), isFlipped: false };
    }),

  // Flip the flashcard
  flipFlashcard: () => set((state) => ({ isFlipped: !state.isFlipped })),

  // Mark correct/incorrect answer
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

  // Reset progress for the current deck
  resetProgress: () =>
    set({
      index: 0,
      isFlipped: false,
      completedFlashcards: [],
      correctAnswers: 0,
      incorrectAnswers: 0,
    }),

  // Set selected category
  setSelectedCategory: (category: string | null) =>
    set({ selectedCategory: category }),

  // Set selected folders
  setSelectedFolders: (folders: string[]) => set({ selectedFolders: folders }),

  // Toggle folder selection
  toggleFolderSelection: (folderName: string) =>
    set((state) => ({
      selectedFolders: state.selectedFolders.includes(folderName)
        ? state.selectedFolders.filter((f) => f !== folderName)
        : [...state.selectedFolders, folderName],
    })),

  startFlashcards: async () => {
    // Load the flashcards dynamically for math chapter 4 unit 1
    const selectedFlashcards = await loadFlashcardsFromFolder();

    const shuffledFlashcards = shuffleArray(selectedFlashcards);

    set({
      flashcards: shuffledFlashcards,
      index: 0,
      completedFlashcards: [],
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: shuffledFlashcards.length,
    });
  },
}));
