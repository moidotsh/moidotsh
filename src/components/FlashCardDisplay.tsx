// src/components/FlashCardDisplay.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "react-feather";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import { splitMathText } from "@/utils/latexUtils";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

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
    setIsCorrect(index === flashcard.correctOptionIndex);
  };

  const handleNext = () => {
    if (flashcard.nextQuestionId) {
      onNext(flashcard.nextQuestionId);
    } else {
      onNext();
    }
  };

  // Function to render LaTeX or text content
  const renderContent = (text: string) => {
    const parts = splitMathText(text);

    return parts.map((part, index) => {
      if (part.type === "latex") {
        return <InlineMath math={part.content} key={index} />;
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      {/* Question or Answer container */}
      <div className="w-full text-center border-2 border-gray-300 rounded-lg p-4 bg-white mb-4 relative">
        <h3 className="text-md">
          {isFlipped && flashcard.back
            ? renderContent(flashcard.back)
            : renderContent(flashcard.front)}
        </h3>
      </div>

      {/* Multiple Choice Options */}
      {flashcard.options && (
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
              disabled={isCorrect === true}
            >
              {renderContent(option)}
            </button>
          ))}
        </div>
      )}

      {/* Navigation and Flip Buttons */}
      <div className="w-full mt-4 flex justify-between px-4">
        <button onClick={onPrevious}>
          <ArrowLeft />
        </button>

        {!flashcard.options && (
          <button onClick={onToggleFlip}>
            <RotateCw />
          </button>
        )}

        {(!flashcard.options || isCorrect === true) && (
          <button onClick={handleNext}>
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashcardDisplay;
