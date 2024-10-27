// src/components/FlashCard/FolderSelector.tsx
import React from "react";

type Props = {
  folders: string[];
  selectedFolders: string[];
  onToggleFolderSelection: (folderName: string) => void;
  onStart: () => void;
};

const FolderSelector = ({
  folders,
  selectedFolders,
  onToggleFolderSelection,
  onStart,
}: Props) => {
  // Map chapters for Pre-Calculus
  const getChaptersForSubcategory = (subcategory: string): number[] => {
    switch (subcategory) {
      case "Pre-Calculus":
        return [4, 5]; // Add all available Pre-Calculus chapters
      // Add other subcategories as needed
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <h2 className="text-xl mb-4">Choose your chapters</h2>
      {folders.map((subcategory) => {
        const chapters = getChaptersForSubcategory(subcategory);
        return (
          <div key={subcategory} className="w-full px-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">{subcategory}</h3>
            <div className="flex flex-wrap gap-2">
              {chapters.map((chapterNum) => (
                <button
                  key={chapterNum}
                  onClick={() => onToggleFolderSelection(chapterNum.toString())}
                  className={`p-2 rounded ${
                    selectedFolders.includes(chapterNum.toString())
                      ? "bg-green-300"
                      : "bg-gray-300"
                  }`}
                >
                  Chapter {chapterNum}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <div className="flex-grow" />
      <div className="w-full flex justify-end pr-4 pb-4">
        <button
          className={`p-2 rounded ${
            selectedFolders.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          onClick={onStart}
          disabled={selectedFolders.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FolderSelector;
