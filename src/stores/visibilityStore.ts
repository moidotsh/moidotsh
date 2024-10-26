import { create } from "zustand";

// Helper type for dynamic visibility keys
type DynamicVisibilityKey<T extends string> = `${T}Visible`;
type DynamicToggleKey<T extends string> = `toggle${T}`;

// Make sure we list all internal names (not display names)
export type AppletName =
  | "Explorer"
  | "Terminal"
  | "Music"
  | "Browser"
  | "Flashcards"; // Use the internal name here

type VisibilityKeys = {
  [K in AppletName as DynamicVisibilityKey<Lowercase<K>>]: boolean;
};

type ToggleFunctions = {
  [K in AppletName as DynamicToggleKey<K>]: () => void;
};

export type VisibilityState = VisibilityKeys &
  ToggleFunctions & {
    browserTitle: string;
    browserContent: JSX.Element | null;
    setBrowserContent: (content: JSX.Element | null) => void;
    setBrowserTitle: (title: string) => void;
    browserLoading: boolean;
    setBrowserLoading: (loading: boolean) => void;
    setBrowserVisible: (visible: boolean) => void;
    setExplorerVisible: (visible: boolean) => void;
    setTerminalVisible: (visible: boolean) => void;
    setMusicVisible: (visible: boolean) => void;
  };

export const useVisibilityStore = create<VisibilityState>((set) => ({
  explorerVisible: true,
  terminalVisible: false,
  musicVisible: false,
  browserVisible: false,
  flashcardsVisible: false, // Use lowercase for state

  // Toggle functions use the proper casing
  toggleExplorer: () =>
    set((state) => ({ explorerVisible: !state.explorerVisible })),
  toggleTerminal: () =>
    set((state) => ({ terminalVisible: !state.terminalVisible })),
  toggleMusic: () => set((state) => ({ musicVisible: !state.musicVisible })),
  toggleBrowser: () =>
    set((state) => ({ browserVisible: !state.browserVisible })),
  toggleFlashcards: () =>
    set((state) => ({ flashcardsVisible: !state.flashcardsVisible })),

  // Other state properties
  browserTitle: "Browser",
  browserContent: null,
  setBrowserContent: (content) => set({ browserContent: content }),
  setBrowserTitle: (title) => set({ browserTitle: title }),
  browserLoading: false,
  setBrowserLoading: (loading) => set({ browserLoading: loading }),
  setBrowserVisible: (visible) => set({ browserVisible: visible }),
  setExplorerVisible: (visible) => set({ explorerVisible: visible }),
  setTerminalVisible: (visible) => set({ terminalVisible: visible }),
  setMusicVisible: (visible) => set({ musicVisible: visible }),
}));
