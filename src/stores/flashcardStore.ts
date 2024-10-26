// flashcardStore.ts
import { create } from "zustand";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";
import { fetchFlashcardsFromAPI } from "@/utils/flashcardUtils";
import { useCardStore } from "./flashcard/cardStore";
import { useProgressStore } from "./flashcard/progressStore";
import { useNavigationStore } from "./flashcard/navigationStore";

// a hook that combines all stores if needed
export const useFlashcardStores = () => {
  const navigation = useNavigationStore();
  const progress = useProgressStore();
  const card = useCardStore();

  return {
    navigation,
    progress,
    card,
  };
};
