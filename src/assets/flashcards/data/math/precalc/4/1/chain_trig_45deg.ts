import { Flashcard } from "@/assets/flashcards/flashcardTypes";

const chain_trig_45deg: Flashcard[] = [
  {
    id: "precalcTrigStep1",
    front: "Convert 45° to radians.",
    options: ["π/4", "π/3", "π/2", "π/6"],
    correctOptionIndex: 0,
    nextQuestionId: "precalcTrigStep2",
    stepNumber: 1,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep2",
    front: "What is the cosine of 45° (or π/4)?",
    options: ["1/2", "√3/2", "√2/2", "0"],
    correctOptionIndex: 2,
    nextQuestionId: "precalcTrigStep3",
    neverDisplayFirst: true,
    stepNumber: 2,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep3",
    front: "What is the sine of 45° (or π/4)?",
    options: ["1/2", "√2/2", "√3/2", "0"],
    correctOptionIndex: 1,
    nextQuestionId: "precalcTrigStep4",
    neverDisplayFirst: true,
    stepNumber: 3,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep4",
    front: "What is the tangent of 45° (or π/4)?",
    options: ["1", "√3", "1/2", "√3/2"],
    correctOptionIndex: 0,
    neverDisplayFirst: true,
    stepNumber: 4,
    totalSteps: 4,
  },
];

export default chain_trig_45deg;
