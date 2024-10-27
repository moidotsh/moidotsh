// src/stores/flashcard/cardStore.ts
import { create } from "zustand";
import { FlashcardWithPath } from "@/utils/flashcardUtils";
import { useProgressStore } from "./progressStore";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";

interface CardState {
  deck: FlashcardWithPath[];
  originalDeck: FlashcardWithPath[];
  currentIndex: number;
  isFlipped: boolean;
  isLoading: boolean;
  error: Error | null;
  cardsPerSession: number;
  sessionProgress: number;
  isSessionComplete: boolean;
  isGameOver: boolean;

  loadDeck: (category: string, folders: string[]) => Promise<void>;
  nextCard: (nextQuestionId?: string) => void;
  previousCard: () => void;
  flipCard: () => void;
  resetDeck: () => void;
  getCurrentCard: () => FlashcardWithPath | null;
  getDeckStatus: () => {
    totalCards: number;
    currentPosition: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const useCardStore = create<CardState>((set, get) => ({
  deck: [],
  originalDeck: [],
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  error: null,
  cardsPerSession: 10,
  sessionProgress: 0,
  isSessionComplete: false,
  isGameOver: false,

  loadDeck: async (category, folders) => {
    set({ isLoading: true, error: null });
    try {
      const cards = await fetchFlashcardsFromAPI(category, folders);
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
      const sessionCards = shuffledCards.slice(0, get().cardsPerSession);

      set({
        originalDeck: cards,
        deck: sessionCards,
        currentIndex: 0,
        isLoading: false,
        sessionProgress: 0,
        isSessionComplete: false,
        isGameOver: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  nextCard: (nextQuestionId) =>
    set((state) => {
      if (state.isGameOver || state.isSessionComplete) {
        return state;
      }

      const hasLivesLeft = useProgressStore.getState().hasLivesLeft();
      if (!hasLivesLeft) {
        return {
          ...state,
          isGameOver: true,
          currentIndex: -1,
          isSessionComplete: true,
        };
      }

      // Handle chained questions
      if (nextQuestionId) {
        const nextIndex = state.deck.findIndex(
          (card) => card.id === nextQuestionId,
        );
        return {
          ...state,
          currentIndex: nextIndex,
          isFlipped: false,
          sessionProgress: state.sessionProgress + 1,
        };
      }

      const newProgress = state.sessionProgress + 1;
      const isComplete = newProgress >= state.cardsPerSession;

      if (isComplete) {
        return {
          ...state,
          currentIndex: -1,
          isSessionComplete: true,
          sessionProgress: newProgress,
        };
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        sessionProgress: newProgress,
        isFlipped: false,
      };
    }),

  previousCard: () =>
    set((state) => {
      const progress = useProgressStore.getState();
      let prevIndex = state.currentIndex - 1;
      while (
        prevIndex >= 0 &&
        (state.deck[prevIndex].never_display_first || // Updated property name
          progress.isCardCompleted(state.deck[prevIndex].id))
      ) {
        prevIndex--;
      }
      return { currentIndex: Math.max(0, prevIndex), isFlipped: false };
    }),

  flipCard: () => set((state) => ({ isFlipped: !state.isFlipped })),

  resetDeck: () =>
    set({
      currentIndex: 0,
      isFlipped: false,
      sessionProgress: 0,
      isSessionComplete: false,
      isGameOver: false,
    }),

  getCurrentCard: () => {
    const state = get();
    return state.currentIndex >= 0 && state.currentIndex < state.deck.length
      ? state.deck[state.currentIndex]
      : null;
  },

  getDeckStatus: () => {
    const state = get();
    const displayableCards = state.deck.filter(
      (card) => !card.never_display_first, // Updated property name
    );
    return {
      totalCards: displayableCards.length,
      currentPosition: state.currentIndex,
      hasNext: state.currentIndex < state.deck.length - 1,
      hasPrevious: state.currentIndex > 0,
    };
  },
}));
