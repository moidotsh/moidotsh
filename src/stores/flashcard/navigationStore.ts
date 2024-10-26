// src/stores/flashcard/navigationStore.ts
import { create } from "zustand";
import { Category } from "@/assets/flashcards/flashcardCategories";

interface NavigationState {
  selectedCategory: Category | null;
  selectedFolders: string[];
  setSelectedCategory: (category: Category | null) => void;
  toggleFolderSelection: (folderName: string) => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedCategory: null,
  selectedFolders: [],

  setSelectedCategory: (category) =>
    set({
      selectedCategory: category,
      selectedFolders: [],
    }),

  toggleFolderSelection: (folderName) =>
    set((state) => ({
      selectedFolders: state.selectedFolders.includes(folderName)
        ? state.selectedFolders.filter((f) => f !== folderName)
        : [...state.selectedFolders, folderName],
    })),

  resetNavigation: () =>
    set({
      selectedCategory: null,
      selectedFolders: [],
    }),
}));
