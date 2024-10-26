import React from "react";
import { Terminal, Music, Briefcase, BookOpen } from "react-feather";
import { registerApplet } from "./appletUtils";
import TerminalApp from "@/components/TerminalApp";
import MusicApp from "@/components/MusicApp";
import NavApp from "@/components/NavApp";
import FlashCardApp from "@/components/FlashCard/FlashCardApp";

// Register existing applets with their internal and display names
registerApplet({
  name: "Explorer",
  displayName: "Explorer",
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
  displayName: "Terminal",
  getIcon: () => React.createElement(Terminal),
  component: TerminalApp,
});

// For Flashcards/Cards, use Flashcards as internal name but Cards as display name
registerApplet({
  name: "Flashcards",
  displayName: "Cards",
  getIcon: () => React.createElement(BookOpen),
  component: FlashCardApp,
  fullSize: true,
});
