// stores/visibilityStore.ts

import { create } from "zustand";

type VisibilityState = {
  explorerVisible: boolean;
  toggleExplorer: () => void;
  setExplorerVisible: (visible: boolean) => void;

  terminalVisible: boolean;
  toggleTerminal: () => void;
  setTerminalVisible: (visible: boolean) => void;

  musicVisible: boolean;
  toggleMusic: () => void;
  setMusicVisible: (visible: boolean) => void;

  browserTitle: string;
  browserVisible: boolean;
  toggleBrowser: () => void;
  setBrowserVisible: (visible: boolean) => void;
  browserContent: JSX.Element | null;
  setBrowserContent: (content: JSX.Element | null) => void;
  setBrowserTitle: (title: string) => void;

  browserLoading: boolean;
  setBrowserLoading: (loading: boolean) => void;

  flashcardsVisible: boolean; // State for flashcards visibility
  toggleFlashcards: () => void; // Function to toggle flashcards
};

export const useVisibilityStore = create<VisibilityState>((set) => ({
  explorerVisible: true,
  toggleExplorer: () =>
    set((state) => ({ explorerVisible: !state.explorerVisible })),
  setExplorerVisible: (visible: boolean) => set({ explorerVisible: visible }),

  terminalVisible: false,
  toggleTerminal: () =>
    set((state) => ({ terminalVisible: !state.terminalVisible })),
  setTerminalVisible: (visible: boolean) => set({ terminalVisible: visible }),

  // Music
  musicVisible: false,
  toggleMusic: () => set((state) => ({ musicVisible: !state.musicVisible })),
  setMusicVisible: (visible: boolean) => set({ musicVisible: visible }),

  /// Browser
  browserVisible: false,
  toggleBrowser: () => {
    set((state) => {
      return { browserVisible: !state.browserVisible };
    });
  },
  setBrowserVisible: (visible: boolean) => {
    set({ browserVisible: visible });
  },
  browserTitle: "Browser",
  browserContent: null,
  setBrowserContent: (content: JSX.Element | null) =>
    set({ browserContent: content }),
  setBrowserTitle: (title: string) => set({ browserTitle: title }),
  browserLoading: false,
  setBrowserLoading: (loading: boolean) => set({ browserLoading: loading }),

  // Flashcards app
  flashcardsVisible: false,
  toggleFlashcards: () =>
    set((state) => ({ flashcardsVisible: !state.flashcardsVisible })),
}));
