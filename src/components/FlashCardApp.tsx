import React, { useState } from "react";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import {
  flashcardCategories,
  MathCategory,
  ComputerScienceCategory,
} from "@/assets/flashcards/flashcardsCategories";
import { Flashcard } from "@/assets/flashcards/flashcardTypes"; // Import Flashcard type
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

// Helper function to shuffle the flashcards array, ensuring cards with neverDisplayFirst don't appear first
const shuffleArray = (array: Flashcard[]) => {
  const allowedFirstCards = array.filter((card) => !card.neverDisplayFirst);

  const firstCard =
    allowedFirstCards.length > 0
      ? allowedFirstCards[Math.floor(Math.random() * allowedFirstCards.length)]
      : array[0];

  const restCards = array
    .filter((card) => card.id !== firstCard.id)
    .map((card) => ({ ...card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((card) => {
      const { sort, ...rest } = card;
      return rest;
    });

  return [firstCard, ...restCards];
};

const FlashcardApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedChains, setCompletedChains] = useState<string[]>([]);

  const categories = Object.keys(flashcardCategories);
  const folders = selectedCategory
    ? Object.keys(
        flashcardCategories[
          selectedCategory as keyof typeof flashcardCategories
        ],
      )
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
    if (!selectedCategory) return;

    let selectedFlashcards: Flashcard[] = [];

    if (selectedCategory === "Math") {
      selectedFlashcards = selectedFolders.flatMap(
        (folderName) =>
          (flashcardCategories.Math as MathCategory)[
            folderName as keyof MathCategory
          ] || [],
      );
    } else if (selectedCategory === "Computer Science") {
      selectedFlashcards = selectedFolders.flatMap(
        (folderName) =>
          (flashcardCategories["Computer Science"] as ComputerScienceCategory)[
            folderName as keyof ComputerScienceCategory
          ] || [],
      );
    }

    setFlashcards(shuffleArray(selectedFlashcards));
    setIndex(0);
  };

  const handleNext = (nextQuestionId?: string) => {
    if (nextQuestionId) {
      const nextIndex = flashcards.findIndex(
        (card) => card.id === nextQuestionId,
      );
      if (nextIndex !== -1) {
        setCompletedChains((prev) => [...prev, flashcards[index].id]);
        setIndex(nextIndex);
      }
    } else {
      let nextIndex = index + 1;
      while (
        nextIndex < flashcards.length &&
        flashcards[nextIndex].neverDisplayFirst &&
        !completedChains.includes(flashcards[nextIndex].id)
      ) {
        nextIndex++;
      }
      if (nextIndex >= flashcards.length) {
        nextIndex = 0;
      }
      setIndex(nextIndex);
    }
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setIndex(index === 0 ? flashcards.length - 1 : index - 1);
    setIsFlipped(false);
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
