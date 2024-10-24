import { Flashcard } from "./flashcardTypes";

export const precalculusFlashcards: Flashcard[] = [
  {
    id: "precalculusQ1",
    front: "Define a function.",
    back: "A relation where each input has a single output.", // Simple flashcard without multiple choice
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ2",
    front: "What is the unit circle?",
    back: "A circle with radius 1 centered at the origin.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalcTrigStep1",
    front: "Convert 45° to radians.",
    options: ["π/4", "π/3", "π/2", "π/6"],
    correctOptionIndex: 0, // 'π/4' is correct
    nextQuestionId: "precalcTrigStep2",
    chapter: 4,
    unit: 1,
    stepNumber: 1,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep2",
    front: "What is the cosine of 45° (or π/4)?",
    options: ["1/2", "√3/2", "√2/2", "0"],
    correctOptionIndex: 2, // '√2/2' is correct
    nextQuestionId: "precalcTrigStep3",
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 2,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep3",
    front: "What is the sine of 45° (or π/4)?",
    options: ["1/2", "√2/2", "√3/2", "0"],
    correctOptionIndex: 1, // '√2/2' is correct
    nextQuestionId: "precalcTrigStep4",
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 3,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep4",
    front: "What is the tangent of 45° (or π/4)?",
    options: ["1", "√3", "1/2", "√3/2"],
    correctOptionIndex: 0, // '1' is correct
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 4,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep5",
    front: "Convert 30° to radians.",
    options: ["π/6", "π/4", "π/3", "π/2"],
    correctOptionIndex: 0, // 'π/6' is correct
    nextQuestionId: "precalcTrigStep6",
    chapter: 4,
    unit: 1,
    stepNumber: 1,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep6",
    front: "What is the cosine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 0, // '√3/2' is correct
    nextQuestionId: "precalcTrigStep7",
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 2,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep7",
    front: "What is the sine of 30° (or π/6)?",
    options: ["√3/2", "1/2", "√2/2", "0"],
    correctOptionIndex: 1, // '1/2' is correct
    nextQuestionId: "precalcTrigStep8",
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 3,
    totalSteps: 4,
  },
  {
    id: "precalcTrigStep8",
    front: "What is the tangent of 30° (or π/6)?",
    options: ["√3", "1/√3", "1", "√2/2"],
    correctOptionIndex: 1, // '1/√3' is correct
    neverDisplayFirst: true, // This step should never display first
    chapter: 4,
    unit: 1,
    stepNumber: 4,
    totalSteps: 4,
  },
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
    correctOptionIndex: 0, // The correct answer is: sin x (1 - cos x)
    nextQuestionId: "verifyTrigStep2",
    chapter: 4,
    unit: 1,
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
    correctOptionIndex: 0, // The correct answer is: 1 - cos^2 x
    nextQuestionId: "verifyTrigStep3",
    neverDisplayFirst: true,
    chapter: 4,
    unit: 1,
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
    correctOptionIndex: 0, // The correct answer is: sin x (1 - cos x) / sin^2 x
    nextQuestionId: "verifyTrigStep4",
    neverDisplayFirst: true,
    chapter: 4,
    unit: 1,
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
    correctOptionIndex: 0, // The correct answer is: (1 - cos x) / sin x
    neverDisplayFirst: true,
    chapter: 4,
    unit: 1,
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
    correctOptionIndex: 0, // The identity is verified
    neverDisplayFirst: true,
    chapter: 4,
    unit: 1,
    stepNumber: 5,
    totalSteps: 5,
  },
  {
    id: "precalculusQ1",
    front: "Define a function.",
    back: "A relation where each input has a single output.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ2",
    front: "What is the unit circle?",
    back: "A circle with radius 1 centered at the origin.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ3",
    front: "What is the range of the sine function?",
    back: "The range of sine is [-1, 1].",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ4",
    front: "What is the period of the cosine function?",
    back: "The period of the cosine function is (2pi).",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ5",
    front: "What is the domain of the tangent function?",
    back: "The domain of the tangent function is all real numbers except odd multiples of \\( \\frac{\\pi}{2} \\).",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ6",
    front: "What is the Pythagorean identity for sine and cosine?",
    back: "\\( \\sin^2 x + \\cos^2 x = 1 \\)", // Added proper LaTeX delimiters
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ7",
    front: "What is the formula for the sine of a sum \\( \\sin(A + B) \\)?",
    back: "\\( \\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B \\)", // Added proper LaTeX delimiters
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ8",
    front:
      "What is the formula for the cosine of a difference \\( \\cos(A - B) \\)?",
    back: "\\( \\cos(A - B) = \\cos A \\cos B + \\sin A \\sin B \\)", // Added proper LaTeX delimiters
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ9",
    front: "What is the double-angle formula for sine?",
    back: "\\( \\sin(2x) = 2 \\sin x \\cos x \\)", // Added proper LaTeX delimiters
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ10",
    front: "What is the double-angle formula for cosine?",
    back: "\\( \\cos(2x) = \\cos^2 x - \\sin^2 x \\)", // Added proper LaTeX delimiters
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ11",
    front: "What is the tangent of 0°?",
    back: "The tangent of 0° is 0.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ12",
    front: "What is the sine of 90°?",
    back: "The sine of 90° is 1.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ13",
    front: "What is the cosine of 180°?",
    back: "The cosine of 180° is -1.",
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ14",
    front: "What is the secant function in terms of cosine?",
    back: "\\( \\sec x = \\frac{1}{\\cos x} \\)", // Fixed LaTeX for fraction
    chapter: 4,
    unit: 1,
  },
  {
    id: "precalculusQ15",
    front: "What is the cotangent function in terms of sine and cosine?",
    back: "\\( \\cot x = \\frac{\\cos x}{\\sin x} \\)", // Proper LaTeX
    chapter: 4,
    unit: 1,
  },
];
