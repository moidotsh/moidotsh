import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";
import { useProgressStore } from "./progressStore";

interface CardState {
  deck: Flashcard[];
  originalDeck: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  isLoading: boolean;
  error: Error | null;
  cardsPerSession: number;
  sessionProgress: number;
  totalSessions: number;
  isSessionComplete: boolean;
  isGameOver: boolean;

  loadDeck: (category: string, folders: string[]) => Promise<void>;
  nextCard: (nextQuestionId?: string) => void;
  previousCard: () => void;
  flipCard: () => void;
  resetDeck: () => void;
  getCurrentCard: () => Flashcard | null;
  getDeckStatus: () => {
    totalCards: number;
    currentPosition: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  getProgress: () => {
    currentSession: number;
    cardsInCurrentSession: number;
    totalCardsInSession: number;
    totalCardsOverall: number;
    completedCards: number;
  };
  setCardsPerSession: (number: number) => void;
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
  totalSessions: 0,
  isSessionComplete: false,
  isGameOver: false,

  loadDeck: async (category, folders) => {
    set({ isLoading: true, error: null });
    try {
      const allCards = await fetchFlashcardsFromAPI(category, folders);
      const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
      const sessionCards = shuffledCards.slice(0, get().cardsPerSession);

      set({
        originalDeck: allCards,
        deck: sessionCards,
        currentIndex: 0,
        isLoading: false,
        sessionProgress: 0,
        isSessionComplete: false,
        isGameOver: false,
      });

      console.log("Loaded deck:", {
        totalCards: allCards.length,
        sessionCards: sessionCards.length,
        cardsPerSession: get().cardsPerSession,
      });
    } catch (error) {
      console.error("Error loading deck:", error);
      set({ error: error as Error, isLoading: false });
    }
  },

  checkGameStatus: () => {
    const hasLivesLeft = useProgressStore.getState().hasLivesLeft();
    if (!hasLivesLeft) {
      set({
        isGameOver: true,
        currentIndex: -1, // This will trigger the completion/game over screen
        isSessionComplete: true,
      });
    }
  },

  nextCard: (nextQuestionId) =>
    set((state) => {
      // Check if game is over or session is complete
      if (state.isGameOver || state.isSessionComplete) {
        return state;
      }

      // Check lives after each card
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
          currentIndex: nextIndex,
          isFlipped: false,
          sessionProgress: state.sessionProgress + 1,
        };
      }

      // Update session progress
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

      // Normal progression
      return {
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
        (state.deck[prevIndex].neverDisplayFirst ||
          progress.isCardCompleted(state.deck[prevIndex].id))
      ) {
        prevIndex--;
      }
      return { currentIndex: Math.max(0, prevIndex), isFlipped: false };
    }),

  flipCard: () =>
    set((state) => ({
      isFlipped: !state.isFlipped,
    })),

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

  getProgress: () => {
    const state = get();
    return {
      currentSession: state.totalSessions + 1,
      cardsInCurrentSession: state.sessionProgress,
      totalCardsInSession: state.cardsPerSession,
      totalCardsOverall: state.originalDeck.length,
      completedCards:
        state.totalSessions * state.cardsPerSession + state.sessionProgress,
    };
  },

  setCardsPerSession: (number: number) => set({ cardsPerSession: number }),

  getDeckStatus: () => {
    const state = get();
    const displayableCards = state.deck.filter(
      (card) => !card.neverDisplayFirst,
    );
    const progress = useProgressStore.getState();
    const completedCount = displayableCards.filter((card) =>
      progress.isCardCompleted(card.id),
    ).length;

    return {
      totalCards: displayableCards.length,
      currentPosition: state.currentIndex,
      hasNext: state.currentIndex < state.deck.length - 1,
      hasPrevious: state.currentIndex > 0,
      completedCount,
      remaining: displayableCards.length - completedCount,
    };
  },
}));
