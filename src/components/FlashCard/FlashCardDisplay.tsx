// FlashCardDisplay.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCw, ArrowRight } from "react-feather";
import FlashCardContent from "./FlashCardContent";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import SelfReportButtons from "./SelfReportButtons";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { useCardStore } from "@/stores/flashcard";

type Props = {
  flashcard: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onNext: (nextQuestionId?: string) => void;
  onPrevious: () => void;
  setCorrectAnswers: (cardId: string) => void;
  setIncorrectAnswers: (cardId: string) => void;
};

const FlashcardDisplay = ({
  flashcard,
  isFlipped,
  onToggleFlip,
  onNext,
  onPrevious,
  setCorrectAnswers,
  setIncorrectAnswers,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const deckStatus = useCardStore((state) => state.getDeckStatus());

  useEffect(() => {
    // Reset state when card changes
    setSelectedOption(null);
    setIsCorrect(null);
    setHasSubmitted(false);
  }, [flashcard.id]);

  const handleNext = () => {
    console.log("Handling next for card:", {
      cardId: flashcard.id,
      hasNextQuestionId: Boolean(flashcard.nextQuestionId),
      nextQuestionId: flashcard.nextQuestionId,
    });
    onNext(flashcard.nextQuestionId);
  };

  // Handle if flashcard is null or undefined
  if (!flashcard) {
    return <div>Loading...</div>; // Render a loading state or nothing
  }

  const handleSelfReportCorrect = () => {
    setCorrectAnswers(flashcard.id);
    handleNext();
  };

  const handleSelfReportIncorrect = () => {
    setIncorrectAnswers(flashcard.id);
    handleNext();
  };

  const handleOptionSelect = (index: number, originalIndex: number) => {
    setSelectedOption(index);
    const isAnswerCorrect = originalIndex === 0;
    setIsCorrect(isAnswerCorrect);

    if (!hasSubmitted) {
      if (isAnswerCorrect) {
        setCorrectAnswers(flashcard.id);
      } else {
        setIncorrectAnswers(flashcard.id);
      }
      setHasSubmitted(true);
    }
  };

  const canProceed =
    !flashcard.options || (selectedOption !== null && isCorrect);

  console.log("Rendering card:", {
    id: flashcard.id,
    isChained: Boolean(flashcard.nextQuestionId),
    currentStep: flashcard.stepNumber,
    totalSteps: flashcard.totalSteps,
    deckStatus,
  });

  const isMultipleChoice = !!flashcard.options;

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      {/* Flashcard content */}
      <div className="w-full text-center border-2 border-gray-300 rounded-lg p-4 bg-white mb-4 relative">
        <h3 className="text-md">
          {isFlipped && flashcard.back ? (
            <FlashCardContent text={flashcard.back} />
          ) : (
            <FlashCardContent text={flashcard.front} />
          )}
        </h3>
      </div>

      {/* Multiple-choice options */}
      {flashcard.options && (
        <MultipleChoiceOptions
          options={flashcard.options}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          isAnswerLocked={false} // Never lock the answer
        />
      )}

      {/* Navigation and Flip Buttons */}
      <div className="w-full mt-4 flex justify-between px-4">
        {!isFlipped ? (
          <button onClick={onPrevious}>
            <ArrowLeft />
          </button>
        ) : !isMultipleChoice ? (
          <SelfReportButtons
            handleSelfReportCorrect={handleSelfReportCorrect}
            handleSelfReportIncorrect={handleSelfReportIncorrect}
          />
        ) : (
          <button onClick={onPrevious}>
            <ArrowLeft />
          </button>
        )}

        {/* Middle Button */}
        {!isMultipleChoice && !isFlipped && (
          <div className="flex justify-center w-full">
            <button onClick={onToggleFlip}>
              <RotateCw />
            </button>
          </div>
        )}

        {/* Right Button */}
        {isFlipped && !isMultipleChoice
          ? null
          : isMultipleChoice && (
              <button
                onClick={handleNext}
                disabled={selectedOption === null || !isCorrect}
              >
                <ArrowRight />
              </button>
            )}
      </div>
    </div>
  );
};

export default FlashcardDisplay;
