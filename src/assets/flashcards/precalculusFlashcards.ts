import { Flashcard } from "./flashcardTypes";

export const precalculusFlashcards: Flashcard[] = [
  {
    id: "precalculusQ1",
    front: "Define a function.",
    back: "A relation where each input has a single output.", // Simple flashcard without multiple choice
  },
  {
    id: "precalculusQ2",
    front: "What is the unit circle?",
    back: "A circle with radius 1 centered at the origin.",
  },
  {
    id: "precalcTrigStep1",
    front: "Step 1: Convert 45° to radians.",
    options: ["π/4", "π/3", "π/2", "π/6"],
    correctOptionIndex: 0, // 'π/4' is correct
    nextQuestionId: "precalcTrigStep2",
  },
  {
    id: "precalcTrigStep2",
    front: "Step 2: What is the cosine of 45° (or π/4)?",
    options: ["1/2", "√3/2", "√2/2", "0"],
    correctOptionIndex: 2, // '√2/2' is correct
    nextQuestionId: "precalcTrigStep3",
    neverDisplayFirst: true, // This step should never display first
  },
  {
    id: "precalcTrigStep3",
    front: "Step 3: What is the sine of 45° (or π/4)?",
    options: ["1/2", "√2/2", "√3/2", "0"],
    correctOptionIndex: 1, // '√2/2' is correct
    nextQuestionId: "precalcTrigStep4",
    neverDisplayFirst: true, // This step should never display first
  },
  {
    id: "precalcTrigStep4",
    front: "Step 4: What is the tangent of 45° (or π/4)?",
    options: ["1", "√3", "1/2", "√3/2"],
    correctOptionIndex: 0, // '1' is correct
    neverDisplayFirst: true, // This step should never display first
  },
  {
    id: "precalcTrigStep5",
    front: "Step 1: Convert 30° to radians.",
    options: ["π/6", "π/4", "π/3", "π/2"],
    correctOptionIndex: 0, // 'π/6' is correct
    nextQuestionId: "precalcTrigStep6",
  },
  {
    id: "precalcTrigStep6",
    front: "Step 2: What is the cosine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 0, // '√3/2' is correct
    nextQuestionId: "precalcTrigStep7",
    neverDisplayFirst: true, // This step should never display first
  },
  {
    id: "precalcTrigStep7",
    front: "Step 3: What is the sine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 1, // '1/2' is correct
    nextQuestionId: "precalcTrigStep8",
    neverDisplayFirst: true, // This step should never display first
  },
  {
    id: "precalcTrigStep8",
    front: "Step 4: What is the tangent of 30° (or π/6)?",
    options: ["√3", "1/√3", "1", "√2/2"],
    correctOptionIndex: 1, // '1/√3' is correct
    neverDisplayFirst: true, // This step should never display first
  },
];
