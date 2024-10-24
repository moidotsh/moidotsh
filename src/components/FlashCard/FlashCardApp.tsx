// FlashCardApp.tsx

import React, { useState, useEffect } from "react";
import withAppTemplate from "../withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import {
  flashcardCategories,
  MathCategory,
  ComputerScienceCategory,
} from "@/assets/flashcards/flashcardCategories";
import { shuffleArray, getSelectedFlashcards } from "@/utils/flashcardUtils";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

const FlashcardApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedFlashcards, setCompletedFlashcards] = useState<string[]>([]); // Track completed flashcards
  const [currentRoot, setCurrentRoot] = useState<string | null>(null); // Track the current chain root
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

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
    if (flashcards.length > 0 && index >= 0) {
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
      flashcardCategories,
    );
    setFlashcards(shuffleArray(selectedFlashcards));
    setIndex(0);
    setCompletedFlashcards([]); // Reset completed flashcards
  };

  // Check if all flashcards have been completed
  const areAllFlashcardsCompleted = () =>
    completedFlashcards.length === flashcards.length;

  const handleNext = (nextQuestionId?: string) => {
    setTotalQuestions(totalQuestions + 1); // Increment total questions asked
    const currentCardId = flashcards[index].id;

    // Mark the current card as completed
    if (!completedFlashcards.includes(currentCardId)) {
      setCompletedFlashcards((prev) => [...prev, currentCardId]);
    }

    // If there is a nextQuestionId, find that card in the deck
    if (nextQuestionId) {
      const nextCardIndex = flashcards.findIndex(
        (card) => card.id === nextQuestionId,
      );
      if (
        nextCardIndex !== -1 &&
        !completedFlashcards.includes(flashcards[nextCardIndex].id)
      ) {
        setIndex(nextCardIndex);
        return;
      }
    }

    // Move to the next card in the list that isn't completed
    let nextIndex = index + 1;
    while (
      nextIndex < flashcards.length &&
      (completedFlashcards.includes(flashcards[nextIndex].id) ||
        flashcards[nextIndex].neverDisplayFirst)
    ) {
      nextIndex++;
    }

    // If all cards are completed or the end is reached, restart or show a message
    if (nextIndex >= flashcards.length) {
      setIndex(-1); // End or restart logic
    } else {
      setIndex(nextIndex);
    }

    setIsFlipped(false); // Reset flip state when moving to the next card
  };

  const handlePrevious = () => {
    setIndex(index === 0 ? flashcards.length - 1 : index - 1);
    setIsFlipped(false); // Reset flip state when moving to the previous card
  };

  // Render the completion message when all flashcards are done
  if (index === -1) {
    return (
      <div className="flex flex-col text-center items-center justify-center h-full w-full">
        <h1>
          You&#39;ve completed this deck with{" "}
          <span className="bg-red-200 p-0.5">
            {correctAnswers} out of {totalQuestions}
          </span>{" "}
          questions correct for a score of{" "}
          {Math.round((correctAnswers / totalQuestions) * 100)}%!
        </h1>

        <button
          className="mt-4 p-2 bg-green-500 text-white rounded"
          onClick={() => {
            setCompletedFlashcards([]); // Reset completed cards
            setIndex(0); // Restart the deck
            setCorrectAnswers(0); // Reset correct answers
            setIncorrectAnswers(0); // Reset incorrect answers
            setTotalQuestions(0); // Reset total questions
          }}
        >
          Restart Deck
        </button>
      </div>
    );
  }

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
      setCorrectAnswers={setCorrectAnswers}
      setIncorrectAnswers={setIncorrectAnswers}
    />
  );
};

export default withAppTemplate(
  FlashcardApp,
  "Flashcards",
  () => <h1>Flashcards</h1>,
  true,
);
