import React from "react";
import { splitMathText } from "@/utils/latexUtils";
import { InlineMath, BlockMath } from "react-katex"; // Import necessary KaTeX components
import "katex/dist/katex.min.css"; // Import KaTeX CSS for proper styling

type Props = {
  options: string[];
  correctOptionIndex: number;
  selectedOption: number | null;
  handleOptionSelect: (index: number) => void;
};

const MultipleChoiceOptions = ({
  options,
  correctOptionIndex,
  selectedOption,
  handleOptionSelect,
}: Props) => {
  return (
    <div className="flex flex-col space-y-2 overflow-y-auto max-h-[10rem] w-full px-4">
      {options.map((option, index) => {
        const parts = splitMathText(option); // Split the option into LaTeX and text parts

        return (
          <button
            key={index}
            className={`p-2 rounded border ${
              selectedOption === index
                ? index === correctOptionIndex
                  ? "bg-green-300"
                  : "bg-red-300"
                : "bg-gray-300"
            }`}
            onClick={() => handleOptionSelect(index)}
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
