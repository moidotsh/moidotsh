// src/components/FlashCard/FlashCardContent.tsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { splitMathText } from "@/utils/latexUtils";

type Props = {
  text: string;
};

const FlashCardContent = ({ text }: Props) => {
  const parts = splitMathText(text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "latex-inline") {
          return <InlineMath key={index} math={part.content} />;
        } else if (part.type === "latex-block") {
          return <BlockMath key={index} math={part.content} />;
        } else {
          return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
};

export default FlashCardContent;
