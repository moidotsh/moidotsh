// src/utils/latexUtils.ts

export const splitMathText = (text: string) => {
  const parts = text.split(/(\\\(.*?\\\)|\\\[.*?\\\])/); // Split on LaTeX expressions

  return parts.map((part) => {
    if (part.startsWith("\\(") || part.startsWith("\\[")) {
      // Strip the outer LaTeX delimiters
      return { type: "latex", content: part.slice(2, -2) }; // Mark as LaTeX content
    } else {
      return { type: "text", content: part }; // Mark as plain text content
    }
  });
};
