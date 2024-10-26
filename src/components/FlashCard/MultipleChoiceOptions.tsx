// src/components/FlashCard/MultipleChoiceOptions.tsx
import React, { useEffect, useState } from "react";
import { splitMathText } from "@/utils/latexUtils";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type Props = {
  options: string[];
  selectedOption: number | null;
  handleOptionSelect: (index: number, originalIndex: number) => void;
  isAnswerLocked: boolean;
};

type ShuffledOption = {
  value: string;
  originalIndex: number;
};

const shuffleArray = (array: string[]): ShuffledOption[] => {
  return array
    .map((value, index) => ({ value, originalIndex: index }))
    .sort(() => Math.random() - 0.5);
};

const MultipleChoiceOptions = ({
  options,
  selectedOption,
  handleOptionSelect,
  isAnswerLocked,
}: Props) => {
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setShuffledOptions(shuffleArray(options));
    setHasAnswered(false);
  }, [options]);

  const getButtonStyle = (index: number, originalIndex: number) => {
    if (selectedOption !== index) return "bg-gray-300";

    if (!hasAnswered) return "bg-blue-300"; // Selected but not submitted

    return originalIndex === 0
      ? "bg-green-300" // Correct answer
      : "bg-red-300"; // Wrong answer
  };

  const handleClick = (index: number, originalIndex: number) => {
    if (isAnswerLocked) return; // Prevent changes if locked
    handleOptionSelect(index, originalIndex);
    setHasAnswered(true);
  };

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto max-h-[10rem] w-full px-4">
      {shuffledOptions.map(({ value, originalIndex }, index) => {
        const parts = splitMathText(value);

        return (
          <button
            key={index}
            className={`p-2 rounded border ${getButtonStyle(index, originalIndex)}
              ${!isAnswerLocked ? "hover:brightness-95" : ""} transition-all`}
            onClick={() => handleClick(index, originalIndex)}
            disabled={isAnswerLocked}
          >
            {parts.map((part, partIndex) => {
              if (part.type === "latex-inline") {
                return <InlineMath key={partIndex} math={part.content} />;
              } else if (part.type === "latex-block") {
                return <BlockMath key={partIndex} math={part.content} />;
              } else {
                return <span key={partIndex}>{part.content}</span>;
              }
            })}
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;
