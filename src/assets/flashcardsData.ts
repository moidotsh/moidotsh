export const flashcardCategories: Record<
  string,
  Record<string, Flashcard[]>
> = {
  Math: {
    Algebra: [
      {
        front: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctOptionIndex: 1, // '4' is the correct answer
      },
      {
        front: "What is the square root of 16?",
        options: ["2", "4", "8", "10"],
        correctOptionIndex: 1, // '4' is correct
      },
    ],
    "Pre-Calculus": [
      {
        front: "Define a function.",
        back: "A relation where each input has a single output.", // Simple flashcard without multiple choice
      },
      {
        front: "What is the unit circle?",
        back: "A circle with radius 1 centered at the origin.",
      },
    ],
    "Calculus 1": [
      {
        front: "Find the derivative of x^2.",
        options: ["x", "2x", "x^2", "1"],
        correctOptionIndex: 1, // '2x' is the correct answer
        nextQuestionId: "derivativeStep2", // Link to the next flashcard
      },
      {
        front: "What is the limit of (x^2 - 4) / (x - 2) as x approaches 2?",
        options: ["2", "4", "Undefined", "1"],
        correctOptionIndex: 1,
        nextQuestionId: "limitStep2", // This will chain to the next flashcard with the next step
      },
      {
        front: "Find the limit by factoring the expression",
        options: ["x + 2", "x - 2", "x^2 - 2", "x^2 + 2"],
        correctOptionIndex: 0, // 'x + 2' is the correct answer
      },
    ],
  },
  "Computer Science": {
    "Data Structures": [
      {
        front: "What is a linked list?",
        options: [
          "A linear data structure",
          "A stack",
          "A queue",
          "A binary tree",
        ],
        correctOptionIndex: 0,
      },
      {
        front: "What is a binary search tree?",
        options: [
          "An array",
          "A tree where each node has two children",
          "A tree where each node's left child is smaller, right is larger",
          "A graph",
        ],
        correctOptionIndex: 2,
      },
    ],
    Algorithms: [
      {
        front: "What is an algorithm?",
        back: "A step-by-step procedure for solving a problem or accomplishing a task.",
      },
      {
        front: "What is Big O Notation?",
        back: "A notation used to classify algorithms based on their worst-case or average-case time complexity.",
      },
    ],
  },
};
