// src/stores/fileSystemStore.ts
import { create } from "zustand";

interface FileSystemState {
  virtualFiles: {
    name: string;
    type: "file";
    path: string;
  }[];
  fileContents: { [path: string]: string };
  addFile: (path: string, name: string) => void;
  updateFileContent: (path: string, content: string) => void;
  getFileContent: (path: string) => string;
  fileExists: (path: string) => boolean;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  virtualFiles: [],
  fileContents: {},

  addFile: (path, name) => {
    // Ensure path starts with / and has no double slashes
    const normalizedPath =
      path === "/" ? "" : path.replace(/\/+/g, "/").replace(/\/$/, "");

    set((state) => {
      // Check if file already exists
      const exists = state.virtualFiles.some(
        (file) => file.path === normalizedPath && file.name === name,
      );

      if (exists) return state;

      console.log("Adding file:", { path: normalizedPath, name }); // Debug log

      return {
        virtualFiles: [
          ...state.virtualFiles,
          { name, type: "file" as const, path: normalizedPath },
        ],
        fileContents: {
          ...state.fileContents,
          [`${normalizedPath}/${name}`]: "",
        },
      };
    });
  },

  updateFileContent: (path, content) => {
    const normalizedPath = path.replace(/\/+/g, "/");
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [normalizedPath]: content,
      },
    }));
  },

  getFileContent: (path) => {
    const normalizedPath = path.replace(/\/+/g, "/");
    return get().fileContents[normalizedPath] || "";
  },

  fileExists: (path) => {
    const normalizedPath = path.replace(/\/+/g, "/");
    return get().virtualFiles.some((file) => {
      const filePath = `${file.path}/${file.name}`.replace(/\/+/g, "/");
      return filePath === normalizedPath;
    });
  },
}));
