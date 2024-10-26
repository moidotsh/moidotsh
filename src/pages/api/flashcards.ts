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
  // Helper function for shuffling
  const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Separate cards into main categories
  const standaloneCards = cards.filter(
    (card) => !card.options && !card.nextQuestionId && !card.neverDisplayFirst,
  );

  const multipleChoiceStarters = cards.filter(
    (card) => card.options && !card.neverDisplayFirst,
  );

  // Process chains
  const chainStarters = cards.filter(
    (card) => card.nextQuestionId && !card.neverDisplayFirst,
  );

  // Build complete chains
  const chains = chainStarters.map((starter) => {
    const chain = [starter];
    let nextId = starter.nextQuestionId;
    while (nextId) {
      const nextCard = cards.find((card) => card.id === nextId);
      if (nextCard) {
        chain.push(nextCard);
        nextId = nextCard.nextQuestionId;
      } else {
        break;
      }
    }
    return chain;
  });

  // Get any remaining chained cards
  const remainingChainedCards = cards.filter(
    (card) =>
      card.neverDisplayFirst &&
      !chains.flat().some((chainCard) => chainCard.id === card.id),
  );

  // Combine all non-chained cards
  const nonChainedCards = [...standaloneCards, ...multipleChoiceStarters];

  // Shuffle non-chained cards
  const shuffledNonChained = shuffle(nonChainedCards);

  // Shuffle the chains themselves
  const shuffledChains = shuffle(chains);

  // Create randomized insertion points for chains
  const totalNonChained = shuffledNonChained.length;
  const insertionPoints = Array(shuffledChains.length)
    .fill(0)
    .map(() => Math.floor(Math.random() * (totalNonChained + 1)));

  // Sort insertion points to maintain relative positions
  insertionPoints.sort((a, b) => a - b);

  // Combine everything with chains inserted at random points
  let result: Flashcard[] = [];
  let nonChainedIndex = 0;

  insertionPoints.forEach((insertPoint, chainIndex) => {
    // Add non-chained cards up to insertion point
    while (nonChainedIndex < insertPoint) {
      result.push(shuffledNonChained[nonChainedIndex]);
      nonChainedIndex++;
    }
    // Add the chain
    result.push(...shuffledChains[chainIndex]);
  });

  // Add any remaining non-chained cards
  while (nonChainedIndex < shuffledNonChained.length) {
    result.push(shuffledNonChained[nonChainedIndex]);
    nonChainedIndex++;
  }

  // Add remaining chained cards at the end
  return [...result, ...remainingChainedCards];
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

    const sortedAndShuffledCards = sortCards(allCards);

    console.log("Response summary:", {
      totalCards: sortedAndShuffledCards.length,
      byType: {
        chainStarters: sortedAndShuffledCards.filter(
          (card) => card.nextQuestionId && !card.neverDisplayFirst,
        ).length,
        standalone: sortedAndShuffledCards.filter(
          (card) =>
            !card.options && !card.nextQuestionId && !card.neverDisplayFirst,
        ).length,
        multipleChoice: sortedAndShuffledCards.filter(
          (card) => card.options && !card.neverDisplayFirst,
        ).length,
        chained: sortedAndShuffledCards.filter((card) => card.neverDisplayFirst)
          .length,
      },
    });

    res.status(200).json(sortedAndShuffledCards);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to load flashcards" });
  }
}
