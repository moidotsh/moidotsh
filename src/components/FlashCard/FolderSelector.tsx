// FolderSelector.tsx
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
  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <h2 className="text-xl mb-4">Choose your folder(s)</h2>
      <div className="flex flex-wrap justify-center">
        {folders.map((folderName) => (
          <button
            key={folderName}
            className={`p-2 rounded m-2 ${selectedFolders.includes(folderName) ? "bg-green-300" : "bg-gray-300"}`}
            onClick={() => onToggleFolderSelection(folderName)}
          >
            {folderName}
          </button>
        ))}
      </div>
      <div className="flex-grow" />
      <div className="w-full flex justify-end pr-4 pb-4">
        <button
          className={`p-2 rounded ${selectedFolders.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
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
