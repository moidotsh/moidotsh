import { Flashcard } from "@/assets/flashcards/flashcardTypes";

// Function to fetch Pre-Calculus flashcards
export const fetchPrecalculusFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const response = await fetch("/api/flashcards?category=precalculus"); // Adjust the API endpoint to filter flashcards
    if (!response.ok) {
      throw new Error("Failed to fetch Pre-Calculus flashcards.");
    }

    const data: Flashcard[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pre-Calculus flashcards:", error);
    return [];
  }
};
