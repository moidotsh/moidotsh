import React from "react";
import FlashCardContent from "./FlashCardContent";

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
      {options.map((option, index) => (
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
          <FlashCardContent text={option} />
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceOptions;
