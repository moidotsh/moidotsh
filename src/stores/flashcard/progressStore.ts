// src/stores/flashcard/progressStore.ts
import { create } from "zustand";

interface ProgressState {
  correctAnswers: number;
  incorrectAnswers: number;
  completedCards: Set<string>;
  displayableTotal: number;

  markCorrect: (cardId: string) => void;
  markIncorrect: (cardId: string) => void;
  markCompleted: (cardId: string) => void;
  setDisplayableTotal: (total: number) => void;
  resetProgress: () => void;
  isCardCompleted: (cardId: string) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  correctAnswers: 0,
  incorrectAnswers: 0,
  completedCards: new Set<string>(),
  displayableTotal: 0,

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
        return {
          incorrectAnswers: state.incorrectAnswers + 1,
          completedCards: newCompleted,
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
    }),

  isCardCompleted: (cardId: string) => get().completedCards.has(cardId),
}));
