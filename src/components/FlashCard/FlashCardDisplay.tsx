import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  XCircle,
  Check,
  X,
} from "react-feather";
import { FlashcardWithPath } from "@/utils/flashcardUtils";
import { useCardStore } from "@/stores/flashcard/cardStore";
import { useProgressStore } from "@/stores/flashcard/progressStore";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { splitMathText } from "@/utils/latexUtils";

type ShuffledOption = {
  text: string;
  originalIndex: number;
};

type Props = {
  flashcard: FlashcardWithPath;
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
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Shuffle options and keep track of original indices
  const shuffledOptions = useMemo(() => {
    if (!flashcard.options) return [];

    const optionsWithIndices: ShuffledOption[] = flashcard.options.map(
      (text, index) => ({
        text,
        originalIndex: index,
      }),
    );

    // Fisher-Yates shuffle
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [
        optionsWithIndices[j],
        optionsWithIndices[i],
      ];
    }

    return optionsWithIndices;
  }, [flashcard.id]); // Only reshuffle when flashcard changes

  const handleExplain = async () => {
    setIsExplaining(true);
    try {
      const response = await fetch("/api/explain-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: flashcard.front,
          answer: flashcard.options ? flashcard.options[0] : flashcard.back,
          selectedAnswer:
            selectedOption !== null && shuffledOptions[selectedOption]
              ? shuffledOptions[selectedOption].text
              : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to get explanation");
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("Sorry, I couldn't get an explanation right now.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (hasSubmitted) return;

    setSelectedOption(index);
    setHasSubmitted(true);

    // Check if selected option was the correct one (originalIndex === 0)
    const isAnswerCorrect = shuffledOptions[index].originalIndex === 0;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setCorrectAnswers(flashcard.id);
    } else {
      setIncorrectAnswers(flashcard.id);
    }
  };

  const handleSelfReportCorrect = () => {
    setCorrectAnswers(flashcard.id);
    handleNext();
  };

  const handleSelfReportIncorrect = () => {
    setIncorrectAnswers(flashcard.id);
    handleNext();
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setHasSubmitted(false);
    setExplanation(null);
    onNext(flashcard.next_question_id ?? undefined);
  };

  const isMultipleChoice = !!flashcard.options;

  const renderContent = (text: string) => {
    const parts = splitMathText(text);
    return parts.map((part, index) => {
      if (part.type === "latex-inline") {
        return <InlineMath key={index} math={part.content} />;
      } else if (part.type === "latex-block") {
        return <BlockMath key={index} math={part.content} />;
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      {/* Flashcard content */}
      <div className="w-full text-center border-2 border-gray-300 rounded-lg p-4 bg-white mb-4 relative">
        <h3 className="text-md">
          {isFlipped && flashcard.back
            ? renderContent(flashcard.back)
            : renderContent(flashcard.front)}
        </h3>
      </div>

      {/* Explanation section */}
      {explanation && (
        <div className="w-full p-4 bg-blue-50 rounded-lg mb-4 text-sm relative">
          {/* Close button */}
          <button
            onClick={() => setExplanation(null)}
            className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Close explanation"
          >
            <X size={16} />
          </button>

          <h4 className="font-bold mb-2 pr-6">Explanation:</h4>
          <div className="whitespace-pre-line">
            {explanation.split("\n").map((line, i) => (
              <div key={i} className="mb-2">
                {renderContent(line)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multiple-choice options */}
      {isMultipleChoice && shuffledOptions.length > 0 && (
        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[10rem] w-full px-4">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedOption === index;
            let buttonClass = "p-2 rounded border transition-all ";

            if (!hasSubmitted) {
              buttonClass += "bg-gray-300 hover:brightness-95";
            } else if (isSelected) {
              buttonClass += isCorrect ? "bg-green-300" : "bg-red-300";
            } else if (option.originalIndex === 0 && hasSubmitted) {
              buttonClass += "bg-green-100"; // Show correct answer after submission
            } else {
              buttonClass += "bg-gray-300";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={buttonClass}
                disabled={hasSubmitted}
              >
                {renderContent(option.text)}
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="w-full mt-4 flex justify-between items-center px-4">
        {isMultipleChoice ? (
          // Multiple choice navigation
          <>
            <button onClick={onPrevious} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </button>

            {hasSubmitted && (
              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <HelpCircle
                  className={`h-5 w-5 ${isExplaining ? "animate-pulse" : ""}`}
                />
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!hasSubmitted}
              className="p-2"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        ) : (
          // Front/Back card navigation
          <>
            {!isFlipped ? (
              // Front of card
              <>
                <button onClick={onPrevious} className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button onClick={onToggleFlip} className="p-2">
                  <RotateCcw className="h-5 w-5" />
                </button>
                <div className="w-10" /> {/* Spacer for alignment */}
              </>
            ) : (
              // Back of card
              <>
                <button
                  onClick={handleSelfReportIncorrect}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={handleExplain}
                  disabled={isExplaining}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HelpCircle
                    className={`h-5 w-5 ${isExplaining ? "animate-pulse" : ""}`}
                  />
                </button>
                <button
                  onClick={handleSelfReportCorrect}
                  className="p-2 text-green-500 hover:text-green-600 transition-colors"
                >
                  <Check className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardDisplay;
