import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Flashcard } from "@/assets/flashcardsData";

type Props = {
  flashcard: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onNext: (nextQuestionId?: string) => void; // Modify onNext to accept optional next question
  onPrevious: () => void;
};

const FlashcardDisplay = ({
  flashcard,
  isFlipped,
  onToggleFlip,
  onNext,
  onPrevious,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // Track selected answer
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false); // Track whether answer has been revealed

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setIsAnswerRevealed(true); // Reveal answer when an option is selected
  };

  return (
    <div className="flex flex-col items-center w-full overflow-y-scroll">
      <div className="flex flex-col justify-center overflow-y-scroll items-center border-2 border-gray-300 rounded-lg p-4 bg-white w-full h-[15rem]">
        {flashcard.options ? (
          <div className="w-full text-center pt-9">
            <h3 className="text-lg mb-4">{flashcard.front}</h3>
            <div className="flex flex-col space-y-2">
              {flashcard.options.map((option, index) => (
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
                  disabled={isAnswerRevealed} // Disable buttons after answer is revealed
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="text-lg cursor-pointer select-none text-center flex items-center justify-center min-h-full w-full"
            onClick={onToggleFlip}
          >
            <span className="block">
              {isFlipped ? flashcard.back : flashcard.front}
            </span>
          </div>
        )}
      </div>

      {/* The Next Button always appears here */}
      <div className="w-full mt-4 flex justify-end pr-4">
        {isAnswerRevealed || !flashcard.options ? (
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() => onNext(flashcard.nextQuestionId)} // Pass the next question ID if available
          >
            {flashcard.nextQuestionId ? "Next Step" : "Next"}
          </button>
        ) : null}
      </div>

      {/* Previous/Next for non-options cards */}
      {!flashcard.options && (
        <div className="flex justify-evenly w-full pt-4">
          <button onClick={onPrevious}>
            <ArrowLeft />
          </button>
          <button onClick={() => onNext(flashcard.nextQuestionId)}>
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;
