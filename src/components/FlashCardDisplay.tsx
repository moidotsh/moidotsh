import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "react-feather";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

type Props = {
  flashcard: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onNext: (nextQuestionId?: string) => void;
  onPrevious: () => void;
};

// Helper function to split LaTeX and non-LaTeX parts
const splitMathText = (text: string) => {
  const parts = text.split(/(\\\(.*?\\\)|\\\[.*?\\\])/); // Splits on inline or block LaTeX
  console.log("Text parts:", parts); // Log the split parts to the console

  return parts.map((part, index) => {
    if (part.startsWith("\\(") || part.startsWith("\\[")) {
      // Strip the outer LaTeX delimiters before passing to InlineMath
      const cleanedPart = part.slice(2, -2); // Remove leading \\( and trailing \\)
      return <InlineMath math={cleanedPart} key={index} />;
    } else {
      return part;
    }
  });
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
      onNext(flashcard.nextQuestionId); // Pass nextQuestionId to parent
    } else {
      onNext(); // Just move to the next card if no nextQuestionId
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      {/* Question or Answer container */}
      <div className="w-full text-center border-2 border-gray-300 rounded-lg p-4 bg-white mb-4 relative">
        <h3 className="text-md">
          {isFlipped && flashcard.back
            ? splitMathText(flashcard.back) // Parse LaTeX on the back as well
            : splitMathText(flashcard.front)}{" "}
          {/* Show the front */}
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
              disabled={isCorrect === true} // Disable all buttons after correct answer
            >
              {splitMathText(option)} {/* Handle LaTeX and plain text */}
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
