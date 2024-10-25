// multiplechoiceoptions.tsx
import React, { useEffect, useState } from "react";
import { splitMathText } from "@/utils/latexUtils";
import { InlineMath, BlockMath } from "react-katex"; // Import necessary KaTeX components
import "katex/dist/katex.min.css"; // Import KaTeX CSS for proper styling

type Props = {
  options: string[];
  selectedOption: number | null;
  handleOptionSelect: (index: number, originalIndex: number) => void;
};

type ShuffledOption = {
  value: string;
  originalIndex: number;
};

const shuffleArray = (array: string[]): ShuffledOption[] => {
  return array
    .map((value, index) => ({ value, originalIndex: index })) // Track original index
    .sort(() => Math.random() - 0.5); // Shuffling logic
};

const MultipleChoiceOptions = ({
  options,
  selectedOption,
  handleOptionSelect,
}: Props) => {
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);

  useEffect(() => {
    setShuffledOptions(shuffleArray(options));
  }, [options]);

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto max-h-[10rem] w-full px-4">
      {shuffledOptions.map(({ value, originalIndex }, index) => {
        const parts = splitMathText(value); // Split the option into LaTeX and text parts

        return (
          <button
            key={index}
            className={`p-2 rounded border ${
              selectedOption !== null
                ? selectedOption === index
                  ? originalIndex === 0 // Check if original index matches the correct answer (always the first option in the original array)
                    ? "bg-green-300" // Green if the correct answer
                    : "bg-red-300" // Red if incorrect answer
                  : "bg-gray-300"
                : "bg-gray-300"
            }`}
            onClick={() => handleOptionSelect(index, originalIndex)}
          >
            {/* Map over the parts and render them appropriately */}
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
