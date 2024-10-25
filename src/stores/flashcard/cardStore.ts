// src/stores/flashcard/cardStore.ts
import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";
import { useProgressStore } from "./progressStore";

// src/stores/flashcard/cardStore.ts
interface CardState {
  deck: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  isLoading: boolean;
  error: Error | null;

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
}

export const useCardStore = create<CardState>((set, get) => ({
  deck: [],
  currentIndex: 0,
  isFlipped: false,
  isLoading: false,
  error: null,

  loadDeck: async (category, folders) => {
    set({ isLoading: true, error: null });
    try {
      const flashcards = await fetchFlashcardsFromAPI(category, folders);
      console.log("Loaded flashcards:", {
        total: flashcards.length,
        types: {
          chainStarters: flashcards.filter(
            (card) => card.nextQuestionId && !card.neverDisplayFirst,
          ).length,
          standalone: flashcards.filter(
            (card) =>
              !card.options && !card.nextQuestionId && !card.neverDisplayFirst,
          ).length,
          multipleChoice: flashcards.filter(
            (card) => card.options && !card.neverDisplayFirst,
          ).length,
          chained: flashcards.filter((card) => card.neverDisplayFirst).length,
        },
      });

      set({
        deck: flashcards,
        currentIndex: 0,
        isLoading: false,
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
        console.log("Following chain to:", { nextQuestionId, nextIndex });
        return { currentIndex: nextIndex, isFlipped: false };
      }

      // Current card is done, mark it as completed
      const currentCard = state.deck[state.currentIndex];
      progress.markCompleted(currentCard.id);

      // Find the next available card
      const findNextCard = (startIndex: number): number => {
        let nextIndex = startIndex;
        while (nextIndex < state.deck.length) {
          const card = state.deck[nextIndex];
          // Card is available if:
          // 1. It's not part of a chain (neverDisplayFirst is false)
          // 2. It hasn't been completed
          // 3. OR it's the start of a new chain
          if (
            (!card.neverDisplayFirst && !progress.isCardCompleted(card.id)) ||
            (card.nextQuestionId && !progress.isCardCompleted(card.id))
          ) {
            return nextIndex;
          }
          nextIndex++;
        }
        return -1;
      };

      const nextIndex = findNextCard(state.currentIndex + 1);

      // If we found no next card, we're done
      if (nextIndex === -1) {
        // Double check if we really completed everything
        const remainingCards = state.deck.filter(
          (card) =>
            (!card.neverDisplayFirst || card.nextQuestionId) &&
            !progress.isCardCompleted(card.id),
        );

        if (remainingCards.length === 0) {
          console.log("All cards completed");
          return { currentIndex: -1, isFlipped: false };
        }

        // If there are still cards, start from beginning
        const firstAvailable = findNextCard(0);
        return { currentIndex: firstAvailable, isFlipped: false };
      }

      console.log("Moving to next card:", {
        from: currentCard.id,
        to: state.deck[nextIndex].id,
        index: nextIndex,
      });

      return { currentIndex: nextIndex, isFlipped: false };
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
