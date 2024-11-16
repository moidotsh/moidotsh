import React, { useState, useRef, useEffect } from "react";
import TextInput from "./TextInput";
import LeftText from "./LeftText";
import BlinkingCaret from "./BlinkingCaret";
import * as commands from "../utils/commands";
import { useRouter } from "next/router";
import withAppTemplate from "./withAppTemplate";

type TerminalAppProps = {
  setDynamicTitle?: (title: string | JSX.Element) => void;
};

type LineContent = {
  command: string;
  output?: string;
  isActive?: boolean;
};

const TerminalApp: React.FC<TerminalAppProps> = ({ setDynamicTitle }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lines, setLines] = useState<LineContent[]>([
    { command: "", isActive: true },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const router = useRouter();

  useEffect(() => {
    setDynamicTitle!(getDynamicTitle());
  }, [router.pathname]);

  const getDynamicTitle = () => (
    <>
      <span className="sm:inline hidden text-sm">
        <LeftText path={router.pathname} />
      </span>
      <span className="sm:hidden inline text-sm">
        <LeftText path={router.pathname} />
      </span>
    </>
  );

  const handleTextAreaClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommandExecution = (commandInput: string) => {
    if (!commandInput.trim()) {
      setLines((prev) => [
        ...prev.slice(0, -1),
        { command: "", isActive: true },
      ]);
      return;
    }

    // Update command history
    setCommandHistory((prev) => [...prev, commandInput]);
    setHistoryIndex(-1);

    // Execute command and get output
    const [command, ...args] = commandInput.split(" ");
    const commandHandler = commands[command as keyof typeof commands];
    let output: string | undefined;

    if (commandHandler) {
      output = commandHandler(args, router) as string;
    } else {
      output = `Command not found: ${command}`;
    }

    // Update lines with executed command and new prompt
    setLines((prev) => [
      ...prev.slice(0, -1),
      { command: commandInput, output, isActive: false },
      { command: "", isActive: true },
    ]);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const historicCommand =
          commandHistory[commandHistory.length - 1 - newIndex];

        setLines((prev) => [
          ...prev.slice(0, -1),
          { command: historicCommand, isActive: true },
        ]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historicCommand =
          commandHistory[commandHistory.length - 1 - newIndex];

        setLines((prev) => [
          ...prev.slice(0, -1),
          { command: historicCommand, isActive: true },
        ]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setLines((prev) => [
          ...prev.slice(0, -1),
          { command: "", isActive: true },
        ]);
      }
    }
  };

  const parseANSI = (text: string): JSX.Element[] => {
    const parts = text.split(/(\x1b\[[0-9;]*m)/);
    let currentStyle: { bold?: boolean; color?: string } = {};

    return parts
      .map((part, index) => {
        if (part.startsWith("\x1b[")) {
          // Parse ANSI code
          const codes = part.slice(2, -1).split(";");
          codes.forEach((code) => {
            switch (code) {
              case "0":
                currentStyle = {};
                break;
              case "1":
                currentStyle.bold = true;
                break;
              case "34":
                currentStyle.color = "text-blue-500";
                break;
              case "37":
                currentStyle.color = "text-gray-300";
                break;
            }
          });
          return null;
        } else {
          // Apply current style to text
          return part ? (
            <span
              key={index}
              className={`${currentStyle.color || ""} ${
                currentStyle.bold ? "font-bold" : ""
              }`}
            >
              {part}
            </span>
          ) : null;
        }
      })
      .filter(Boolean) as JSX.Element[];
  };

  return (
    <div
      onClick={handleTextAreaClick}
      className="w-full h-full overflow-y-auto font-mono text-sm"
      onKeyDown={handleKeyDown}
    >
      {lines.map((line, index) => (
        <div key={index} className="leading-tight">
          <div className="flex items-center">
            <span className="font-fira-code pr-2">$</span>
            {line.isActive ? (
              <TextInput
                handleCommandExecution={handleCommandExecution}
                ref={inputRef}
                initialValue={line.command}
              />
            ) : (
              <span>{line.command}</span>
            )}
            {line.isActive && <BlinkingCaret />}
          </div>
          {line.output && (
            <div className="pl-4 font-mono">
              {line.output.includes("<span") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: line.output }}
                  className="flex flex-wrap gap-2 whitespace-pre-wrap break-words"
                />
              ) : (
                <div className="whitespace-pre-wrap break-words">
                  {line.output}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default withAppTemplate(TerminalApp, "Terminal", (router) => (
  <>
    <span className="sm:inline hidden">st ~</span>
    <span className="sm:hidden inline">
      <LeftText path={router.pathname} />
    </span>
  </>
));
