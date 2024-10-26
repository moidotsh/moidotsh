// src/assets/flashcards/flashcardTypes.ts
export interface Flashcard {
  id: string;
  front: string;
  back?: string;
  options?: string[];
  nextQuestionId?: string;
  stepNumber?: number;
  totalSteps?: number;
  neverDisplayFirst?: boolean;

  // Metadata fields
  _sourceFile?: string;
  _sourcePath?: string;
}
