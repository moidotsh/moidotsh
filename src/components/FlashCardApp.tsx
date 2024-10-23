import React, { useState } from "react";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import { flashcardCategories, Flashcard } from "@/assets/flashcardsData";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

// Helper function to shuffle the flashcards array
const shuffleArray = (array: Flashcard[]) => {
  return array
    .map((card) => ({ ...card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((card) => {
      const { sort, ...rest } = card;
      return rest;
    });
};

const FlashcardApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = Object.keys(flashcardCategories);
  const folders = selectedCategory
    ? Object.keys(flashcardCategories[selectedCategory])
    : [];

  const setTitle = useVisibilityStore((state) => state.setBrowserTitle);
  setTitle(
    flashcards.length > 0
      ? flashcards[index]?.front || "Flashcards"
      : selectedCategory
        ? "Choose your folder(s)"
        : "Choose a Category",
  );

  const toggleFolderSelection = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName],
    );
  };

  const startFlashcards = () => {
    const selectedFlashcards: Flashcard[] = selectedFolders.flatMap(
      (folderName) => flashcardCategories[selectedCategory!][folderName],
    );
    setFlashcards(shuffleArray(selectedFlashcards));
    setIndex(0);
  };

  const handleNext = (nextQuestionId?: string) => {
    if (nextQuestionId) {
      const nextIndex = flashcards.findIndex(
        (card) => card.front === nextQuestionId,
      );
      if (nextIndex !== -1) {
        setIndex(nextIndex);
      }
    } else {
      setIndex((index + 1) % flashcards.length);
    }
    setIsFlipped(false); // Reset flip state when moving to the next card
  };

  const handlePrevious = () => {
    setIndex(index === 0 ? flashcards.length - 1 : index - 1);
    setIsFlipped(false); // Reset flip state when moving to the previous card
  };

  if (flashcards.length === 0) {
    if (!selectedCategory) {
      return (
        <CategorySelector
          categories={categories}
          onSelectCategory={setSelectedCategory}
        />
      );
    } else {
      return (
        <FolderSelector
          folders={folders}
          selectedFolders={selectedFolders}
          onToggleFolderSelection={toggleFolderSelection}
          onStart={startFlashcards}
        />
      );
    }
  }

  return (
    <FlashcardDisplay
      flashcard={flashcards[index]}
      isFlipped={isFlipped}
      onToggleFlip={() => setIsFlipped(!isFlipped)}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
};

export default withAppTemplate(
  FlashcardApp,
  "Flashcards",
  () => "Flashcards",
  true,
);
