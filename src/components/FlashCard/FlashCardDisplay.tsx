import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCw, ArrowRight } from "react-feather";
import FlashCardContent from "./FlashCardContent";
import MultipleChoiceOptions from "./MultipleChoiceOptions";
import SelfReportButtons from "./SelfReportButtons";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";

type Props = {
  flashcard: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onNext: (nextQuestionId?: string) => void;
  onPrevious: () => void;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  setIncorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
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
  const [firstClickRecorded, setFirstClickRecorded] = useState(false);

  // Reset state when the flashcard changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setFirstClickRecorded(false);
  }, [flashcard]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const isAnswerCorrect = index === flashcard.correctOptionIndex;
    setIsCorrect(isAnswerCorrect);

    if (!firstClickRecorded) {
      if (isAnswerCorrect) {
        setCorrectAnswers((prevCorrect) => prevCorrect + 1);
      } else {
        setIncorrectAnswers((prevIncorrect) => prevIncorrect + 1);
      }
      setFirstClickRecorded(true);
    }
  };

  const handleNext = () => {
    if (flashcard.nextQuestionId) {
      onNext(flashcard.nextQuestionId);
    } else {
      onNext();
    }
  };

  const handleSelfReportCorrect = () => {
    setCorrectAnswers((prevCorrect) => prevCorrect + 1);
    handleNext();
  };

  const handleSelfReportIncorrect = () => {
    setIncorrectAnswers((prevIncorrect) => prevIncorrect + 1);
    handleNext();
  };

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
      {isMultipleChoice && (
        <MultipleChoiceOptions
          options={flashcard.options ?? []}
          correctOptionIndex={flashcard.correctOptionIndex ?? -1} // Provide fallback value if undefined
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
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
