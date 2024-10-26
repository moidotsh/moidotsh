import { create } from "zustand";

// Helper type for dynamic visibility keys
type DynamicVisibilityKey<T extends string> = `${Lowercase<T>}Visible`;
type DynamicToggleKey<T extends string> = `toggle${T}`;

// Make sure we list all internal names (not display names)
export type AppletName =
  | "Explorer"
  | "Terminal"
  | "Music"
  | "Browser"
  | "Flashcards"; // Use the internal name here

// Create a type that includes all possible visibility keys with their boolean values
export type VisibilityKeys = {
  [K in AppletName as DynamicVisibilityKey<K>]: boolean;
};

// Create a type that includes all possible toggle functions
export type ToggleFunctions = {
  [K in AppletName as DynamicToggleKey<K>]: () => void;
};

// Combine everything into the main state type
export type VisibilityState = VisibilityKeys &
  ToggleFunctions & {
    // Other state properties
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

// Helper type to get all possible visibility keys
export type VisibilityStateKeys = keyof VisibilityState;

// Create the store
export const useVisibilityStore = create<VisibilityState>((set) => ({
  // Initial visibility states
  explorerVisible: true,
  terminalVisible: false,
  musicVisible: false,
  browserVisible: false,
  flashcardsVisible: false,

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

// Type guard to check if a key is a visibility key
export function isVisibilityKey(
  key: string,
): key is `${Lowercase<AppletName>}Visible` {
  return key.endsWith("Visible") && key in useVisibilityStore.getState();
}
