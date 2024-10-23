// flashcardTypes.ts

export type Flashcard = {
  id: string; // Unique identifier for each flashcard
  front: string;
  back?: string; // Optional, as some flashcards may not have a back
  options?: string[]; // Optional, for multiple-choice questions
  correctOptionIndex?: number; // Optional, used if options are present
  nextQuestionId?: string; // Optional, for chaining flashcards
  neverDisplayFirst?: boolean; // Optional flag to prevent displaying this card first
};
