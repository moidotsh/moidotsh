import { create } from "zustand";

const MAX_LIVES = 3; // Define max lives constant

interface ProgressState {
  correctAnswers: number;
  incorrectAnswers: number;
  completedCards: Set<string>;
  displayableTotal: number;
  livesLeft: number;

  markCorrect: (cardId: string) => void;
  markIncorrect: (cardId: string) => void;
  markCompleted: (cardId: string) => void;
  setDisplayableTotal: (total: number) => void;
  resetProgress: () => void;
  isCardCompleted: (cardId: string) => boolean;
  hasLivesLeft: () => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  correctAnswers: 0,
  incorrectAnswers: 0,
  completedCards: new Set<string>(),
  displayableTotal: 0,
  livesLeft: MAX_LIVES,

  markCorrect: (cardId: string) =>
    set((state) => {
      if (!state.completedCards.has(cardId)) {
        const newCompleted = new Set(state.completedCards).add(cardId);
        return {
          correctAnswers: state.correctAnswers + 1,
          completedCards: newCompleted,
        };
      }
      return state;
    }),

  markIncorrect: (cardId: string) =>
    set((state) => {
      if (!state.completedCards.has(cardId)) {
        const newCompleted = new Set(state.completedCards).add(cardId);
        const newLivesLeft = state.livesLeft - 1;
        return {
          incorrectAnswers: state.incorrectAnswers + 1,
          completedCards: newCompleted,
          livesLeft: newLivesLeft,
        };
      }
      return state;
    }),

  markCompleted: (cardId: string) =>
    set((state) => ({
      completedCards: new Set(state.completedCards).add(cardId),
    })),

  setDisplayableTotal: (total: number) => set({ displayableTotal: total }),

  resetProgress: () =>
    set({
      correctAnswers: 0,
      incorrectAnswers: 0,
      completedCards: new Set(),
      displayableTotal: 0,
      livesLeft: MAX_LIVES,
    }),

  isCardCompleted: (cardId: string) => get().completedCards.has(cardId),

  hasLivesLeft: () => get().livesLeft > 0,
}));
