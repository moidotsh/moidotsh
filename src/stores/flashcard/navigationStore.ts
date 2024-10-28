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
    set((state) => {
      // Handle batch selection/deselection
      if (folderName.startsWith("select-multiple:")) {
        const newFolders = folderName
          .replace("select-multiple:", "")
          .split(",");
        return {
          selectedFolders: [
            ...new Set([...state.selectedFolders, ...newFolders]),
          ],
        };
      }

      if (folderName.startsWith("deselect-multiple:")) {
        const foldersToRemove = new Set(
          folderName.replace("deselect-multiple:", "").split(","),
        );
        return {
          selectedFolders: state.selectedFolders.filter(
            (folder) => !foldersToRemove.has(folder),
          ),
        };
      }

      // Handle single folder toggle
      return {
        selectedFolders: state.selectedFolders.includes(folderName)
          ? state.selectedFolders.filter((f) => f !== folderName)
          : [...state.selectedFolders, folderName],
      };
    }),

  resetNavigation: () =>
    set({
      selectedCategory: null,
      selectedFolders: [],
    }),
}));
