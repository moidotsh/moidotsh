// src/pages/api/flashcards.ts
import { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { Flashcard } from "@/assets/flashcards/flashcardTypes";

const flashcardsBaseDir = path.join(
  process.cwd(),
  "src/assets/flashcards/data",
);

const loadAllFlashcardsFromSubject = (basePath: string): Flashcard[] => {
  const fullPath = path.join(flashcardsBaseDir, basePath);
  let allCards: Flashcard[] = [];

  const processDirectory = (dirPath: string) => {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    entries.forEach((entry) => {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        try {
          const fileContent = readFileSync(entryPath, "utf8");
          const cards = JSON.parse(fileContent);

          // Add source file and path information
          const relativePath = path.relative(fullPath, dirPath);
          cards.forEach((card: Flashcard) => {
            card._sourceFile = entry.name;
            card._sourcePath = relativePath;
          });

          // Handle chain files
          if (entry.name.startsWith("chain_")) {
            cards.forEach((card: Flashcard, index: number) => {
              if (index > 0) card.neverDisplayFirst = true;
            });
          }

          allCards.push(...cards);
          console.log(
            `Loaded ${cards.length} cards from ${relativePath}/${entry.name}`,
          );
        } catch (error) {
          console.error(`Error processing ${entry.name}:`, error);
        }
      }
    });
  };

  processDirectory(fullPath);
  return allCards;
};

const sortCards = (cards: Flashcard[]): Flashcard[] => {
  // Separate cards into different types
  const standaloneCards = cards.filter(
    (card) => !card.options && !card.nextQuestionId && !card.neverDisplayFirst,
  );

  const multipleChoiceStarters = cards.filter(
    (card) => card.options && !card.neverDisplayFirst,
  );

  // Group chain starters by their source file
  const chainGroups = new Map<string, Flashcard[]>();
  cards.forEach((card) => {
    if (card.nextQuestionId && !card.neverDisplayFirst) {
      const key = `${card._sourcePath}/${card._sourceFile}`;
      if (!chainGroups.has(key)) {
        chainGroups.set(key, []);
      }
      chainGroups.get(key)?.push(card);
    }
  });

  // Get all chain starters
  const chainStarters = Array.from(chainGroups.values()).flat();

  // Get remaining chained cards
  const chainedCards = cards.filter((card) => card.neverDisplayFirst);

  // Combine all cards in desired order
  return [
    ...chainStarters,
    ...standaloneCards,
    ...multipleChoiceStarters,
    ...chainedCards,
  ];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { category, folders } = req.query;
    console.log("API request received:", { category, folders });

    if (!category || !folders) {
      return res.status(400).json({ error: "Missing category or folders" });
    }

    const foldersArray = Array.isArray(folders) ? folders : folders.split(",");
    let allCards: Flashcard[] = [];

    if (category === "Math") {
      const subjectMappings: { [key: string]: string } = {
        "Pre-Calculus": "math/precalc",
        Algebra: "math/algebra",
        "Calculus 1": "math/calc1",
      };

      for (const folderName of foldersArray) {
        const basePath = subjectMappings[folderName];
        if (!basePath) {
          console.error(`No mapping found for: ${folderName}`);
          continue;
        }

        const cards = loadAllFlashcardsFromSubject(basePath);
        console.log(`Loaded ${cards.length} cards from ${basePath}`);
        allCards.push(...cards);
      }
    }

    const sortedCards = sortCards(allCards);

    console.log("Response summary:", {
      totalCards: sortedCards.length,
      byType: {
        chainStarters: sortedCards.filter(
          (card) => card.nextQuestionId && !card.neverDisplayFirst,
        ).length,
        standalone: sortedCards.filter(
          (card) =>
            !card.options && !card.nextQuestionId && !card.neverDisplayFirst,
        ).length,
        multipleChoice: sortedCards.filter(
          (card) => card.options && !card.neverDisplayFirst,
        ).length,
        chained: sortedCards.filter((card) => card.neverDisplayFirst).length,
      },
    });

    res.status(200).json(sortedCards);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to load flashcards" });
  }
}
