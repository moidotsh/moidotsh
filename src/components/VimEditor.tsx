import React, { useState, useEffect, useRef } from "react";
import { useFileSystemStore } from "@/stores/fileSystemStore";

interface VimEditorProps {
  filePath: string;
  initialContent: string;
  onExit: () => void;
}

export const VimEditor: React.FC<VimEditorProps> = ({
  filePath,
  initialContent,
  onExit,
}) => {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<"normal" | "insert">("normal");
  const [statusMessage, setStatusMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileSystem = useFileSystemStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode === "normal") {
      switch (e.key) {
        case "i":
          e.preventDefault();
          setMode("insert");
          setStatusMessage("-- INSERT --");
          break;
        case ":":
          e.preventDefault();
          const cmd = prompt(":", "");
          if (cmd === "w") {
            fileSystem.updateFileContent(filePath, content);
            setStatusMessage(`"${filePath}" written`);
          } else if (cmd === "q") {
            onExit();
          } else if (cmd === "wq" || cmd === "x") {
            fileSystem.updateFileContent(filePath, content);
            onExit();
          }
          break;
        case "Escape":
          setStatusMessage("");
          break;
      }
    } else if (mode === "insert" && e.key === "Escape") {
      e.preventDefault();
      setMode("normal");
      setStatusMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-green-400 p-2 rounded">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => mode === "insert" && setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow bg-transparent outline-none resize-none w-full h-full font-mono"
        readOnly={mode === "normal"}
        spellCheck="false"
      />
      <div className="flex justify-between border-t border-gray-700 pt-1 text-xs">
        <span>{filePath}</span>
        <span>
          {statusMessage || (mode === "insert" ? "-- INSERT --" : "")}
        </span>
      </div>
    </div>
  );
};
