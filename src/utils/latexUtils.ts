export const splitMathText = (text: string) => {
  // Clean text by removing unwanted control characters like \u000c
  const cleanedText = text.replace(/[\u000c]/g, "");

  // This regex ensures LaTeX inline \( ... \) and block \[ ... \] are split properly, without losing any backslashes
  const parts = cleanedText.split(/(\\\(.*?\\\)|\\\[.*?\\\])/g);

  return parts.map((part) => {
    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      // Handle inline LaTeX
      return { type: "latex-inline", content: part.slice(2, -2) };
    } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
      // Handle block LaTeX
      return { type: "latex-block", content: part.slice(2, -2) };
    } else {
      // Plain text
      return { type: "text", content: part };
    }
  });
};
