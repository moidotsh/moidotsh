// src/utils/appletRegistration.ts
import React from "react";
import {
  Terminal,
  Music,
  Briefcase,
  BookOpen,
  Heart,
  Globe,
  MessageCircle,
} from "react-feather";
import { registerApplet } from "./appletUtils";
import TerminalApp from "@/components/TerminalApp";
import MusicApp from "@/components/MusicApp";
import NavApp from "@/components/NavApp";
import FlashCardApp from "@/components/FlashCard/FlashCardApp";
import { useProgressStore } from "@/stores/flashcard";
import BrowserApp from "@/components/BrowserApp";
import BoatChat from "@/components/BoatChat";

// Register existing applets with their internal and display names
// appletRegistration.ts
registerApplet({
  name: "Browser",
  displayName: "Browser",
  getIcon: () => React.createElement(Globe),
  component: BrowserApp,
  fullSize: true,
  showInDock: false, // This will hide it from the dock
});

registerApplet({
  name: "Explorer",
  displayName: "Files",
  getIcon: () => React.createElement(Briefcase),
  component: NavApp,
});

registerApplet({
  name: "Music",
  displayName: "Music",
  getIcon: () => React.createElement(Music),
  component: MusicApp,
});

registerApplet({
  name: "Terminal",
  displayName: "Shell",
  getIcon: () => React.createElement(Terminal),
  component: TerminalApp,
});

registerApplet({
  name: "Chat",
  displayName: "Chat",
  getIcon: () => React.createElement(MessageCircle),
  component: BoatChat,
  fullSize: true,
  showInDock: false, // This will hide it from the dock
});

const getFlashcardTitle = () => {
  const incorrectAnswers = useProgressStore.getState().incorrectAnswers;
  const MAX_LIVES = 3;

  const hearts = Array(MAX_LIVES)
    .fill(0)
    .map((_, index) =>
      React.createElement(Heart, {
        key: index,
        size: 16,
        style: {
          marginLeft: "4px",
          display: "inline",
          fill: index < MAX_LIVES - incorrectAnswers ? "red" : "black",
          color: index < MAX_LIVES - incorrectAnswers ? "red" : "black",
        },
      }),
    );

  return React.createElement(
    "div",
    { style: { display: "flex", alignItems: "center" } },
    React.createElement("span", null, "Flashcards"),
    ...hearts,
  );
};

registerApplet({
  name: "Flashcards",
  displayName: "Cards",
  getIcon: () => React.createElement(BookOpen),
  component: FlashCardApp,
  getDynamicTitle: getFlashcardTitle,
  fullSize: true,
});
