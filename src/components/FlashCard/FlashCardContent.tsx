import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { splitMathText } from "@/utils/latexUtils";

type Props = {
  text: string;
};

const FlashCardContent = ({ text }: Props) => {
  const parts = splitMathText(text);

  // Log the raw LaTeX before rendering
  // console.log("Raw LaTeX text before rendering:", text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "latex-inline") {
          return <InlineMath key={index}>{part.content}</InlineMath>;
        } else if (part.type === "latex-block") {
          return <BlockMath key={index}>{part.content}</BlockMath>;
        } else {
          return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
};

export default FlashCardContent;
