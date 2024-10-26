// src/components/FlashCard/FlashCardApp.tsx
import React, { useEffect, useState } from "react";
import withAppTemplate from "../withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import {
  flashcardCategories,
  Category,
} from "@/assets/flashcards/flashcardCategories";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";
import {
  useNavigationStore,
  useProgressStore,
  useCardStore,
} from "@/stores/flashcard";
import { Heart } from "react-feather";

const FlashcardApp = ({
  setDynamicTitle,
}: {
  setDynamicTitle?: (title: JSX.Element) => void;
}) => {
  const {
    selectedCategory,
    selectedFolders,
    setSelectedCategory,
    toggleFolderSelection,
  } = useNavigationStore();

  const {
    correctAnswers,
    incorrectAnswers,
    displayableTotal,
    setDisplayableTotal,
    resetProgress,
  } = useProgressStore();

  const {
    deck,
    currentIndex,
    isFlipped,
    isLoading,
    error,
    loadDeck,
    nextCard,
    previousCard,
    flipCard,
    getCurrentCard,
    resetDeck,
    getDeckStatus,
  } = useCardStore();

  useEffect(() => {
    if (setDynamicTitle) {
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

      const titleElement = React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        React.createElement("span", null, "Flashcards"),
        ...hearts,
      );

      setDynamicTitle(titleElement);
    }
  }, [incorrectAnswers, setDynamicTitle]);

  const setTitle = useVisibilityStore((state) => state.setBrowserTitle);

  // Set displayable total when deck is loaded
  useEffect(() => {
    if (deck.length > 0) {
      const displayableCards = deck.filter((card) => !card.neverDisplayFirst);
      setDisplayableTotal(displayableCards.length);
    }
  }, [deck, setDisplayableTotal]);

  const startFlashcards = async () => {
    if (selectedCategory && selectedFolders.length > 0) {
      await loadDeck(selectedCategory, selectedFolders);
    }
  };

  const handleRestartDeck = async () => {
    resetProgress(); // Reset progress first
    resetDeck(); // Reset card state
    await startFlashcards(); // Reload the cards
  };

  // Show completion message
  if (currentIndex === -1) {
    const totalAnswered = correctAnswers + incorrectAnswers;
    const scorePercentage = Math.round(
      (correctAnswers / displayableTotal) * 100,
    );

    return (
      <div className="flex flex-col text-center items-center justify-center h-full w-full">
        <h1>
          You&#39ve completed the deck with{" "}
          <span className="bg-green-200 p-0.5">
            {correctAnswers} out of {displayableTotal}
          </span>{" "}
          questions correct for a score of {scorePercentage}%!
        </h1>
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded"
          onClick={handleRestartDeck}
        >
          Restart Deck
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <div>Loading flashcards...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error loading flashcards: {error.message}</div>;
  }

  if (!selectedCategory) {
    return (
      <CategorySelector
        categories={Object.keys(flashcardCategories) as Category[]}
        onSelectCategory={setSelectedCategory}
      />
    );
  }

  // Show folder selection
  if (deck.length === 0 && selectedCategory) {
    const category = selectedCategory as Category;
    const folders = flashcardCategories[category]
      ? Object.keys(flashcardCategories[category])
      : [];

    return (
      <FolderSelector
        folders={folders}
        selectedFolders={selectedFolders}
        onToggleFolderSelection={toggleFolderSelection}
        onStart={startFlashcards}
      />
    );
  }

  const currentCard = getCurrentCard();
  if (!currentCard) {
    return <div>No flashcard available</div>;
  }

  return (
    <FlashcardDisplay
      flashcard={currentCard}
      isFlipped={isFlipped}
      onToggleFlip={flipCard}
      onNext={nextCard}
      onPrevious={previousCard}
      setCorrectAnswers={(cardId: string) =>
        useProgressStore.getState().markCorrect(cardId)
      }
      setIncorrectAnswers={(cardId: string) =>
        useProgressStore.getState().markIncorrect(cardId)
      }
    />
  );
};

export default withAppTemplate(FlashcardApp, "Flashcards", true);
