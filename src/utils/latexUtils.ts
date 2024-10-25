export const splitMathText = (text: string | undefined) => {
  if (!text) return []; // Return an empty array if the text is undefined or null

  // Clean text by removing unwanted control characters like \u000c
  const cleanedText = text.replace(/[\u000c]/g, "");

  // This regex ensures LaTeX inline \( ... \) and block \[ ... \] are split properly, without losing any backslashes
  const parts = cleanedText.split(/(\\\(.*?\\\)|\\\[.*?\\\])/g);

  return parts.map((part) => {
    if (part.startsWith("\\(") && part.endsWith("\\)")) {
      return { type: "latex-inline", content: part.slice(2, -2) };
    } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
      return { type: "latex-block", content: part.slice(2, -2) };
    } else {
      return { type: "text", content: part };
    }
  });
};
