// src/components/FlashCard/FlashCardApp.tsx
import React, { useEffect } from "react";
import withAppTemplate from "../withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";
import CategorySelector from "./CategorySelector";
import FolderSelector from "./FolderSelector";
import FlashcardDisplay from "./FlashCardDisplay";
import {
  useNavigationStore,
  useProgressStore,
  useCardStore,
} from "@/stores/flashcard";

const FlashcardApp = () => {
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

  // Show category selection
  if (!selectedCategory) {
    return (
      <CategorySelector
        categories={Object.keys(flashcardCategories)}
        onSelectCategory={setSelectedCategory}
      />
    );
  }

  // Show folder selection
  if (deck.length === 0) {
    return (
      <FolderSelector
        folders={Object.keys(flashcardCategories[selectedCategory])}
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

export default withAppTemplate(
  FlashcardApp,
  "Flashcards",
  () => <h1>Flashcards</h1>,
  true,
);
