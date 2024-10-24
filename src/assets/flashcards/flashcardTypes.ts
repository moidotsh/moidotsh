export type Flashcard = {
  id: string; // Unique identifier for each flashcard
  front: string;
  back?: string; // Optional, as some flashcards may not have a back
  options?: string[]; // Optional, for multiple-choice questions
  correctOptionIndex?: number; // Optional, used if options are present
  nextQuestionId?: string; // Optional, for chaining flashcards
  neverDisplayFirst?: boolean; // Optional flag to prevent displaying this card first
  chapter: number; // Chapter number for sorting
  unit: number; // Unit number for sorting (e.g., 4.2 for chapter 4, unit 2)
  stepNumber?: number; // Optional step number for multi-step sequences
  totalSteps?: number; // Optional total number of steps for sequences
};
