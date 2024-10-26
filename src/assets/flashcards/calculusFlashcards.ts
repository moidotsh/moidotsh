import { Flashcard } from "./flashcardTypes";

export const calculusFlashcards: Flashcard[] = [
  {
    id: "derivativeStep1",
    front: "Find the derivative of x^2.",
    options: ["x", "2x", "x^2", "1"],
    nextQuestionId: "derivativeStep2",
  },
  {
    id: "derivativeStep2",
    front: "What rule do you use to differentiate powers of x?",
    options: ["Quotient rule", "Product rule", "Power rule", "Chain rule"],
  },
];
