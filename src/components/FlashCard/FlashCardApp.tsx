import React, { useEffect } from "react";
import withAppTemplate from "../withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";
import { useFlashcardStore } from "@/stores/flashcardStore";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";

const FlashcardApp = () => {
  const currentSelectedCategory = useFlashcardStore(
    (state) => state.selectedCategory,
  );
  const currentSelectedFolders = useFlashcardStore(
    (state) => state.selectedFolders,
  );
  const currentFlashcards = useFlashcardStore((state) => state.flashcards);
  const currentIndex = useFlashcardStore((state) => state.index);
  const isFlipped = useFlashcardStore((state) => state.isFlipped);
  const completedCards = useFlashcardStore(
    (state) => state.completedFlashcards,
  );
  const totalQuestions = useFlashcardStore((state) => state.totalQuestions);
  const correctAnswers = useFlashcardStore((state) => state.correctAnswers);
  const incorrectAnswers = useFlashcardStore((state) => state.incorrectAnswers);

  const setSelectedCategory = useFlashcardStore(
    (state) => state.setSelectedCategory,
  );
  const setIsFlipped = useFlashcardStore((state) => state.flipFlashcard);

  const categories = Object.keys(flashcardCategories);
  const folders = currentSelectedCategory
    ? Object.keys(
        flashcardCategories[
          currentSelectedCategory as keyof typeof flashcardCategories
        ],
      )
    : [];

  const setTitle = useVisibilityStore((state) => state.setBrowserTitle);

  // Dynamically update the title with category, chapter, unit, and step progression
  useEffect(() => {
    if (currentFlashcards.length > 0 && currentIndex >= 0) {
      const currentCard = currentFlashcards[currentIndex];
      let baseTitle = `${currentSelectedCategory || "Flashcards"} - Chapter ${
        currentCard.chapter
      }, Unit ${currentCard.unit}`;

      // Include step number if it's part of a multi-step process
      if (currentCard.totalSteps && currentCard.stepNumber) {
        baseTitle += ` (${currentCard.stepNumber}/${currentCard.totalSteps})`;
      }

      setTitle(baseTitle);
    } else {
      setTitle(
        currentSelectedCategory ? "Choose your folder(s)" : "Choose a Category",
      );
    }
  }, [currentFlashcards, currentIndex, currentSelectedCategory, setTitle]);

  const toggleFolderSelection = (folderName: string) => {
    useFlashcardStore.getState().toggleFolderSelection(folderName);
  };

  const startFlashcards = () => {
    if (currentSelectedCategory) {
      useFlashcardStore
        .getState()
        .startFlashcards(currentSelectedCategory, currentSelectedFolders);
    } else {
      console.error("Category not selected!");
    }
  };

  // Check if all flashcards have been completed
  const areAllFlashcardsCompleted = () =>
    completedCards.length === currentFlashcards.length;

  const handleNext = (nextQuestionId?: string) => {
    useFlashcardStore.getState().nextFlashcard(nextQuestionId);
  };

  const handlePrevious = () => {
    useFlashcardStore.getState().previousFlashcard();
  };

  // Render the completion message when all flashcards are done
  if (currentIndex === -1) {
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
            useFlashcardStore.getState().resetProgress();
          }}
        >
          Restart Deck
        </button>
      </div>
    );
  }

  if (currentFlashcards.length === 0) {
    if (!currentSelectedCategory) {
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
          selectedFolders={currentSelectedFolders}
          onToggleFolderSelection={toggleFolderSelection}
          onStart={startFlashcards}
        />
      );
    }
  }

  return (
    <FlashcardDisplay
      flashcard={currentFlashcards[currentIndex]}
      isFlipped={isFlipped}
      onToggleFlip={setIsFlipped}
      onNext={handleNext}
      onPrevious={handlePrevious}
      setCorrectAnswers={useFlashcardStore.getState().markCorrect}
      setIncorrectAnswers={useFlashcardStore.getState().markIncorrect}
    />
  );
};

export default withAppTemplate(
  FlashcardApp,
  "Flashcards",
  () => <h1>Flashcards</h1>,
  true,
);
