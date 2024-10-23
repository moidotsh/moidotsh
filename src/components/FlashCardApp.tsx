import React, { useState } from "react";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import {
  flashcardCategories,
  Flashcard,
} from "@/assets/flashcards/flashcardsCategories";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

// Helper function to shuffle the flashcards array, ensuring cards with neverDisplayFirst don't appear first
const shuffleArray = (array: Flashcard[]) => {
  // Separate flashcards that are allowed to be the first card
  const allowedFirstCards = array.filter((card) => !card.neverDisplayFirst);

  // Shuffle the allowedFirstCards to choose the first card
  const firstCard =
    allowedFirstCards.length > 0
      ? allowedFirstCards[Math.floor(Math.random() * allowedFirstCards.length)]
      : array[0]; // Fallback to the first card if no valid cards

  // Shuffle the rest of the array, ensuring that neverDisplayFirst cards are only shown in a chain
  const restCards = array
    .filter(
      (card) => card.id !== firstCard.id, // Exclude the first card
    )
    .map((card) => ({ ...card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((card) => {
      const { sort, ...rest } = card;
      return rest;
    });

  return [firstCard, ...restCards]; // Return the first card followed by the shuffled rest
};

const FlashcardApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedChains, setCompletedChains] = useState<string[]>([]); // Tracks completed chains to ensure valid display

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

  // Handle next question logic, with optional nextQuestionId
  const handleNext = (nextQuestionId?: string) => {
    if (nextQuestionId) {
      // Move to the next question in the chain
      const nextIndex = flashcards.findIndex(
        (card) => card.id === nextQuestionId,
      );
      if (nextIndex !== -1) {
        setCompletedChains((prev) => [...prev, flashcards[index].id]); // Track the current card as completed in the chain
        setIndex(nextIndex);
      }
    } else {
      let nextIndex = index + 1;

      // Ensure we skip any `neverDisplayFirst` cards that are not part of a completed chain
      while (
        nextIndex < flashcards.length &&
        flashcards[nextIndex].neverDisplayFirst &&
        !completedChains.includes(flashcards[nextIndex].id)
      ) {
        nextIndex++;
      }

      // Check if there are valid cards left, otherwise wrap around
      if (nextIndex >= flashcards.length) {
        nextIndex = 0;
      }

      setIndex(nextIndex); // Move to the next valid question
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
      onNext={handleNext} // Correctly pass handleNext
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
