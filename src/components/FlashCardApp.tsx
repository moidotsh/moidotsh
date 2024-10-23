import React, { useState, useEffect } from "react";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import {
  flashcardCategories,
  MathCategory,
  ComputerScienceCategory,
} from "@/assets/flashcards/flashcardCategories";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

// Helper function to shuffle the flashcards array
const shuffleArray = (array: Flashcard[]): Flashcard[] => {
  const allowedFirstCards = array.filter((card) => !card.neverDisplayFirst);
  const firstCard =
    allowedFirstCards.length > 0
      ? allowedFirstCards[Math.floor(Math.random() * allowedFirstCards.length)]
      : array[0];

  const restCards = array
    .filter((card) => card.id !== firstCard.id)
    .sort(() => Math.random() - 0.5);

  return [firstCard, ...restCards];
};

// Helper function to get flashcards based on selected category and folders
const getSelectedFlashcards = (
  selectedCategory: string,
  selectedFolders: string[],
): Flashcard[] => {
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
  return selectedFlashcards;
};

const FlashcardApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedChains, setCompletedChains] = useState<string[]>([]); // Track completed root cards
  const [currentRoot, setCurrentRoot] = useState<string | null>(null); // Track the current chain root

  const categories = Object.keys(flashcardCategories);
  const folders = selectedCategory
    ? Object.keys(
        flashcardCategories[
          selectedCategory as keyof typeof flashcardCategories
        ],
      )
    : [];

  const setTitle = useVisibilityStore((state) => state.setBrowserTitle);

  // Dynamically update the title with category, chapter, unit, and step progression
  useEffect(() => {
    if (flashcards.length > 0) {
      const currentCard = flashcards[index];
      let baseTitle = `${selectedCategory || "Flashcards"} - Chapter ${
        currentCard.chapter
      }, Unit ${currentCard.unit}`;

      // Include step number if it's part of a multi-step process
      if (currentCard.totalSteps && currentCard.stepNumber) {
        baseTitle += ` (${currentCard.stepNumber}/${currentCard.totalSteps})`;
      }

      setTitle(baseTitle);
    } else {
      setTitle(
        selectedCategory ? "Choose your folder(s)" : "Choose a Category",
      );
    }
  }, [flashcards, index, selectedCategory, setTitle]);

  const toggleFolderSelection = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName],
    );
  };

  const startFlashcards = () => {
    if (!selectedCategory) return;

    const selectedFlashcards = getSelectedFlashcards(
      selectedCategory,
      selectedFolders,
    );
    setFlashcards(shuffleArray(selectedFlashcards));
    setIndex(0);
  };

  // Handle the chain by following the `nextQuestionId`
  const handleNext = (nextQuestionId?: string) => {
    if (nextQuestionId) {
      const nextIndex = flashcards.findIndex(
        (card) => card.id === nextQuestionId,
      );
      if (nextIndex !== -1) {
        setIndex(nextIndex);
      }
    } else {
      let nextIndex = index + 1;

      // Skip over any cards that have `neverDisplayFirst` and ensure we avoid completed chains
      while (
        nextIndex < flashcards.length &&
        (flashcards[nextIndex].neverDisplayFirst ||
          completedChains.includes(flashcards[nextIndex].id))
      ) {
        nextIndex++;
      }

      // If the current root card was part of a chain and it completes, add it to completedChains
      if (currentRoot && !flashcards[nextIndex]?.nextQuestionId) {
        setCompletedChains((prev) => [...prev, currentRoot]);
      }

      if (nextIndex >= flashcards.length) {
        nextIndex = 0;
      }

      setCurrentRoot(
        flashcards[nextIndex].nextQuestionId ? flashcards[nextIndex].id : null,
      );

      setIndex(nextIndex);
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
  () => <h1>Flashcards</h1>,
  true,
);
