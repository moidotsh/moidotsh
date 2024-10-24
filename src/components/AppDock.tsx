// AppDock.tsx

import React, { useState, useEffect } from "react";
import { Terminal, Music, Briefcase, BookOpen } from "react-feather";
import { useVisibilityStore } from "@/stores/visibilityStore";

type Props = {};

function AppDock({}: Props) {
  const explorerVisible = useVisibilityStore((state) => state.explorerVisible);
  const toggleExplorer = useVisibilityStore((state) => state.toggleExplorer);
  const terminalVisible = useVisibilityStore((state) => state.terminalVisible);
  const toggleTerminal = useVisibilityStore((state) => state.toggleTerminal);
  const musicVisible = useVisibilityStore((state) => state.musicVisible);
  const toggleMusic = useVisibilityStore((state) => state.toggleMusic);

  const flashcardsVisible = useVisibilityStore(
    (state) => state.flashcardsVisible,
  );
  const toggleFlashcards = useVisibilityStore(
    (state) => state.toggleFlashcards,
  );

  const Apps = [
    { name: "Explorer", icon: <Briefcase />, visible: explorerVisible },
    { name: "Music", icon: <Music />, visible: musicVisible },
    { name: "Terminal", icon: <Terminal />, visible: terminalVisible },
    { name: "Cards", icon: <BookOpen />, visible: flashcardsVisible },
  ];

  const [isTouched, setIsTouched] = useState<number | null>(null);

  let timeout: any = null;

  // Function to handle icon click
  const handleIconClick = (app: any, index: number) => {
    // Toggle visibility based on app name
    app.name === "Explorer" && toggleExplorer();
    app.name === "Terminal" && toggleTerminal();
    app.name === "Music" && toggleMusic();
    app.name === "Cards" && toggleFlashcards();

    // Set the touched state to move the icon upwards
    setIsTouched(index);

    // Clear any existing timeout
    if (timeout) clearTimeout(timeout);

    // Set a timeout to move the icon back to original position
    timeout = setTimeout(() => {
      setIsTouched(null);
    }, 500); // 500 ms delay
  };

  return (
    // the pt-20 + overflow-y-hidden was the key combo to still showing full icons and dots without adding vertical scroll
    <div className="absolute w-full flex bottom-0 pt-20 justify-center overflow-y-hidden">
      <div className="z-[2000]">
        <div className="w-[60vh] text-center">
          <ul className="list-none flex justify-evenly items-center ">
            {Apps.map((app, index) => (
              <li
                key={index}
                className={`flex flex-col items-center bottom-10 w-20 relative cursor-default`}
                onClick={() => handleIconClick(app, index)}
              >
                <div
                  className={`bg-white w-20 h-20 flex flex-col justify-center items-center rounded transform transition-transform will-change-transform ${isTouched === index ? "-translate-y-5" : ""}`}
                >
                  {app.icon}
                  <span className="select-none">{app.name.toLowerCase()}</span>
                </div>
                <div
                  style={{
                    background:
                      app.visible === false ? "transparent" : "#ffffff", // Set to transparent when not visible
                  }}
                  className="absolute bottom-[-5px] left-[50%] translate-x-[-50%] w-3 h-3 rounded-full"
                ></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AppDock;
