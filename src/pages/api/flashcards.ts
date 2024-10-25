// api/flashcards.ts
import { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";

// Base directory for flashcards
const flashcardsBaseDir = path.join(
  process.cwd(),
  "src/assets/flashcards/data", // This points to the location where your flashcards are stored
);

// Utility function to load flashcards from a specific folder
const loadFlashcardsFromFolder = (folderPath: string): Flashcard[] => {
  const fullPath = path.join(flashcardsBaseDir, folderPath);
  console.log(`Loading flashcards from: ${fullPath}`); // Add this line for debugging

  const filesAndFolders = readdirSync(fullPath, { withFileTypes: true });
  let flashcards: Flashcard[] = [];

  filesAndFolders.forEach((entry) => {
    const entryPath = path.join(fullPath, entry.name);

    if (entry.isDirectory()) {
      // If it's a directory, recursively load flashcards from it
      flashcards.push(
        ...loadFlashcardsFromFolder(path.join(folderPath, entry.name)),
      );
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      // If it's a JSON file, load and parse the flashcards
      const fileContent = readFileSync(entryPath, "utf8");
      const parsedFlashcards = JSON.parse(fileContent);
      console.log(`Parsed flashcards from ${entry.name}:`, parsedFlashcards); // Debugging log
      flashcards.push(...parsedFlashcards);
    }
  });

  return flashcards;
};

// The API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { category, folders } = req.query;

    // Ensure folders is an array
    const foldersArray = Array.isArray(folders) ? folders : [folders];

    let selectedFlashcards: Flashcard[] = [];

    // Add a mapping for folder names
    const folderMappings: { [key: string]: string } = {
      "Pre-Calculus": "precalc", // Correct folder name
      Algebra: "algebra",
      "Calculus 1": "calc1",
    };

    if (category === "Math") {
      // Use the folderMappings to translate folder names
      selectedFlashcards = foldersArray.flatMap((folderName) =>
        loadFlashcardsFromFolder(
          `math/${folderMappings[folderName as string]?.toLowerCase() || folderName?.toLowerCase()}`,
        ),
      );
    }
    console.log("Selected flashcards:", selectedFlashcards); // Check if any flashcards are being loaded

    res.status(200).json(selectedFlashcards);
  } catch (error) {
    console.error("Error loading flashcards:", error);
    res.status(500).json({ error: "Failed to load flashcards." });
  }
}
