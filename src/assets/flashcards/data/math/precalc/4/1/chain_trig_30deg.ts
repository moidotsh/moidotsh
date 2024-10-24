import { Flashcard } from "@/assets/flashcards/flashcardTypes";

const chain_trig_30deg: Flashcard[] = [
  {
    id: "precalcTrigStep5",
    front: "Convert 30° to radians.",
    options: ["π/6", "π/4", "π/3", "π/2"],
    correctOptionIndex: 0,
    nextQuestionId: "precalcTrigStep6",
    stepNumber: 1,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep6",
    front: "What is the cosine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 0,
    nextQuestionId: "precalcTrigStep7",
    neverDisplayFirst: true,
    stepNumber: 2,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep7",
    front: "What is the sine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 1,
    nextQuestionId: "precalcTrigStep8",
    neverDisplayFirst: true,
    stepNumber: 3,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep8",
    front: "What is the tangent of 30° (or π/6)?",
    options: ["√3", "1/√3", "1", "√2/2"],
    correctOptionIndex: 1,
    neverDisplayFirst: true,
    stepNumber: 4,
    totalSteps: 4,
  },
];

export default chain_trig_30deg;
