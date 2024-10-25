// src/stores/flashcard/navigationStore.ts
import { create } from "zustand";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";

interface NavigationState {
  selectedCategory: string | null;
  selectedFolders: string[];

  // Actions
  setSelectedCategory: (category: string | null) => void;
  setSelectedFolders: (folders: string[]) => void;
  toggleFolderSelection: (folderName: string) => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedCategory: null,
  selectedFolders: [],

  setSelectedCategory: (category) =>
    set({
      selectedCategory: category,
      selectedFolders: [], // Reset folders when category changes
    }),

  setSelectedFolders: (folders) => set({ selectedFolders: folders }),

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
