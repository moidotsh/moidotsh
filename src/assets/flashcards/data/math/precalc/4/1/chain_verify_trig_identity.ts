import { Flashcard } from "@/assets/flashcards/flashcardTypes";

const chain_verify_trig_identity: Flashcard[] = [
  {
    id: "verifyTrigStep1",
    front:
      "Start with the left-hand side of the identity: \\( \\frac{\\sin x}{1 + \\cos x} \\). Multiply numerator and denominator by \\( 1 - \\cos x \\). What is the new numerator?",
    options: [
      "\\( \\sin x (1 - \\cos x) \\)",
      "\\( \\sin^2 x \\)",
      "\\( \\sin x \\)",
      "\\( 1 - \\cos^2 x \\)",
    ],
    correctOptionIndex: 0,
    nextQuestionId: "verifyTrigStep2",
    stepNumber: 1,
    totalSteps: 5,
  },
  {
    id: "verifyTrigStep2",
    front:
      "Now, simplify the denominator: \\( (1 + \\cos x)(1 - \\cos x) \\). What does the denominator simplify to?",
    options: [
      "\\( 1 - \\cos^2 x \\)",
      "\\( 1 + \\cos^2 x \\)",
      "\\( \\sin^2 x \\)",
      "\\( 2 \\)",
    ],
    correctOptionIndex: 0,
    nextQuestionId: "verifyTrigStep3",
    neverDisplayFirst: true,
    stepNumber: 2,
    totalSteps: 5,
  },
  {
    id: "verifyTrigStep3",
    front:
      "Use the Pythagorean identity \\( 1 - \\cos^2 x = \\sin^2 x \\) to simplify the denominator. What is the expression now?",
    options: [
      "\\( \\frac{\\sin x (1 - \\cos x)}{\\sin^2 x} \\)",
      "\\( \\frac{1 - \\cos x}{\\sin^2 x} \\)",
      "\\( \\frac{\\sin^2 x}{\\sin x} \\)",
      "\\( \\frac{\\cos x}{\\sin x} \\)",
    ],
    correctOptionIndex: 0,
    nextQuestionId: "verifyTrigStep4",
    neverDisplayFirst: true,
    stepNumber: 3,
    totalSteps: 5,
  },
  {
    id: "verifyTrigStep4",
    front:
      "Simplify the fraction by canceling a \\( \\sin x \\) from the numerator and denominator. What is the simplified expression?",
    options: [
      "\\( \\frac{1 - \\cos x}{\\sin x} \\)",
      "\\( \\sin x \\)",
      "\\( \\cos x \\)",
      "\\( \\frac{1}{\\sin x} \\)",
    ],
    correctOptionIndex: 0,
    neverDisplayFirst: true,
    stepNumber: 4,
    totalSteps: 5,
  },
  {
    id: "verifyTrigStep5",
    front:
      "You've now shown that \\( \\frac{\\sin x}{1 + \\cos x} = \\frac{1 - \\cos x}{\\sin x} \\). What is the final result?",
    options: [
      "Identity verified",
      "The equation is incorrect",
      "Simplify further",
      "Multiply both sides by 2",
    ],
    correctOptionIndex: 0,
    neverDisplayFirst: true,
    stepNumber: 5,
    totalSteps: 5,
  },
];

export default chain_verify_trig_identity;
