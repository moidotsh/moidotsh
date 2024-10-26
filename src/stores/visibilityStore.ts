import { create } from "zustand";

export type AppletName =
  | "Explorer"
  | "Terminal"
  | "Music"
  | "Browser"
  | "Flashcards";

export type VisibilityState = {
  explorerVisible: boolean;
  terminalVisible: boolean;
  musicVisible: boolean;
  browserVisible: boolean;
  flashcardsVisible: boolean;

  browserTitle: string;
  browserContent: JSX.Element | null;
  browserLoading: boolean;

  // Functions
  toggleExplorer: () => void;
  toggleTerminal: () => void;
  toggleMusic: () => void;
  toggleBrowser: () => void;
  toggleFlashcards: () => void;

  setBrowserContent: (content: JSX.Element | null) => void;
  setBrowserTitle: (title: string) => void;
  setBrowserLoading: (loading: boolean) => void;
  setBrowserVisible: (visible: boolean) => void;
  openBrowser: (content: JSX.Element | null, title: string) => void;
};

export const useVisibilityStore = create<VisibilityState>((set) => ({
  // Initial visibility states
  explorerVisible: true,
  terminalVisible: false,
  musicVisible: false,
  browserVisible: false,
  flashcardsVisible: false,

  // Browser state
  browserTitle: "Browser",
  browserContent: null,
  browserLoading: false,

  // Toggle functions
  toggleExplorer: () =>
    set((state) => ({ explorerVisible: !state.explorerVisible })),
  toggleTerminal: () =>
    set((state) => ({ terminalVisible: !state.terminalVisible })),
  toggleMusic: () => set((state) => ({ musicVisible: !state.musicVisible })),
  toggleBrowser: () =>
    set((state) => ({ browserVisible: !state.browserVisible })),
  toggleFlashcards: () =>
    set((state) => ({ flashcardsVisible: !state.flashcardsVisible })),

  // Browser functions
  setBrowserContent: (content) => set({ browserContent: content }),
  setBrowserTitle: (title) => set({ browserTitle: title }),
  setBrowserLoading: (loading) => set({ browserLoading: loading }),
  setBrowserVisible: (visible) => set({ browserVisible: visible }),

  // New combined function for opening browser
  openBrowser: (content, title) =>
    set({
      browserContent: content,
      browserTitle: title,
      browserVisible: true,
    }),
}));
