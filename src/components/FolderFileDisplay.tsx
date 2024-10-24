// FolderFileDisplay.tsx
import { Folder as FolderType } from "./FolderStructureHelper";
import { useVisibilityStore } from '@/stores/visibilityStore';

type FolderFileDisplayProps = {
  currentFolder: FolderType | null;
};

const FolderFileDisplay = ({ currentFolder }: FolderFileDisplayProps) => {
  const explorerVisible = useVisibilityStore((state) => state.explorerVisible);

  if (!explorerVisible || !currentFolder) return null;

  const sortedChildren = [...currentFolder.children].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return 0;
  });

  return (null
  );
};

export default FolderFileDisplay;

