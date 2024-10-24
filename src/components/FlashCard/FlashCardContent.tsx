import React from "react";
import { splitMathText } from "@/utils/latexUtils";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

type Props = {
  text: string;
};

const FlashCardContent = ({ text }: Props) => {
  const parts = splitMathText(text);
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "latex") {
          return <InlineMath math={part.content} key={index} />;
        } else {
          return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
};

export default FlashCardContent;
