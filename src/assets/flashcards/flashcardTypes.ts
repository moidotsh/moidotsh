// src/assets/flashcards/flashcardTypes.ts
export interface Flashcard {
  id: string;
  front: string;
  back?: string | null;
  options?: string[] | null;
  nextQuestionId?: string | null;
  stepNumber?: number | null;
  totalSteps?: number | null;
  never_display_first?: boolean;
  source_file?: string | null; // Updated to match database
  source_path?: string | null; // Updated to match database
}

// src/utils/flashcardUtils.ts
export interface FlashcardWithPath {
  id: string;
  front: string;
  back?: string | null;
  options?: string[] | null;
  next_question_id?: string | null;
  step_number?: number | null;
  total_steps?: number | null;
  never_display_first?: boolean;
  source_file?: string | null; // Matching database field
  source_path?: string | null; // Matching database field

  // Additional path-related fields
  lesson_id: string;
  lesson_name: string;
  unit_id: string;
  unit_number: number;
  chapter_id: string;
  chapter_number: number;
  subcategory_id: string;
  subcategory_name: string;
  category_id: string;
  category_name: string;
  created_at?: string;
  user_id?: string | null;
}

export function convertToFlashcard(
  flashcardWithPath: FlashcardWithPath,
): Flashcard {
  return {
    id: flashcardWithPath.id,
    front: flashcardWithPath.front,
    back: flashcardWithPath.back,
    options: flashcardWithPath.options,
    nextQuestionId: flashcardWithPath.next_question_id,
    stepNumber: flashcardWithPath.step_number,
    totalSteps: flashcardWithPath.total_steps,
    never_display_first: flashcardWithPath.never_display_first,
    source_file: flashcardWithPath.source_file,
    source_path: flashcardWithPath.source_path,
  };
}
