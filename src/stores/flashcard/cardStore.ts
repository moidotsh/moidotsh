// src/stores/flashcard/cardStore.ts
import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";
import { useProgressStore } from "./progressStore";

// src/stores/flashcard/cardStore.ts
interface CardState {
  deck: Flashcard[];
  originalDeck: Flashcard[]; // Store the full deck
  currentIndex: number;
  isFlipped: boolean;
  isLoading: boolean;
  error: Error | null;
  cardsPerSession: number; // New property
  sessionProgress: number; // New property
  totalSessions: number; // New property

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
  originalDeck: [], // Keep the full deck
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  error: null,
  cardsPerSession: 10, // Default value, can be made configurable
  sessionProgress: 0, // Track current session
  totalSessions: 0, // Track total sessions completed

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

  nextCard: (nextQuestionId) =>
    set((state) => {
      const progress = useProgressStore.getState();

      if (nextQuestionId) {
        // Follow the chain
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
      const isSessionComplete = newProgress >= state.cardsPerSession;

      if (isSessionComplete) {
        // Load next session of cards
        const nextSessionStart =
          state.cardsPerSession * (state.totalSessions + 1);
        const nextSessionCards = state.originalDeck.slice(
          nextSessionStart,
          nextSessionStart + state.cardsPerSession,
        );

        return {
          deck: nextSessionCards.length > 0 ? nextSessionCards : state.deck,
          currentIndex: 0,
          sessionProgress: 0,
          totalSessions: state.totalSessions + 1,
          isFlipped: false,
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

  // Add method to get progress info
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

  flipCard: () =>
    set((state) => ({
      isFlipped: !state.isFlipped,
    })),

  resetDeck: () =>
    set({
      currentIndex: 0,
      isFlipped: false,
    }),

  getCurrentCard: () => {
    const state = get();
    return state.currentIndex >= 0 && state.currentIndex < state.deck.length
      ? state.deck[state.currentIndex]
      : null;
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
