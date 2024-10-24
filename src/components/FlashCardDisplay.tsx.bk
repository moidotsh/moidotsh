// FlashCardDisplay.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { flashcardCategories } from "@/assets/flashcards/flashcardCategories";

type Props = {
  flashcard: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onNext: (nextQuestionId?: string) => void;
  onPrevious: () => void;
};

const FlashcardDisplay = ({
  flashcard,
  isFlipped,
  onToggleFlip,
  onNext,
  onPrevious,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset state when the flashcard changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
  }, [flashcard]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);

    if (index === flashcard.correctOptionIndex) {
      setIsCorrect(true); // Correct answer
    } else {
      setIsCorrect(false); // Incorrect answer
    }
  };

  const handleNext = () => {
    if (flashcard.nextQuestionId) {
      onNext(flashcard.nextQuestionId); // Pass nextQuestionId to parent
    } else {
      onNext(); // Just move to the next card if no nextQuestionId
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      {/* Question container */}
      <div className="w-full text-center border-2 border-gray-300 rounded-lg p-4 bg-white mb-4">
        <h3 className="text-md">{flashcard.front}</h3>
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-2 overflow-y-auto max-h-[10rem] w-full px-4">
        {flashcard.options?.map((option, index) => (
          <button
            key={index}
            className={`p-2 rounded border ${
              selectedOption === index
                ? index === flashcard.correctOptionIndex
                  ? "bg-green-300"
                  : "bg-red-300"
                : "bg-gray-300"
            }`}
            onClick={() => handleOptionSelect(index)}
            disabled={isCorrect === true} // Disable all buttons after correct answer
          >
            {option}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="w-full mt-4 flex justify-end pr-4">
        {isCorrect === true && (
          <button
            className="p-2 rounded bg-blue-500 text-white flex items-center"
            onClick={handleNext}
          >
            <ArrowRight className="text-white" />
          </button>
        )}
      </div>

      {/* Previous/Next for non-options cards */}
      {!flashcard.options && (
        <div className="flex justify-evenly w-full pt-4">
          <button onClick={onPrevious}>
            <ArrowLeft />
          </button>
          <button onClick={handleNext}>
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;
