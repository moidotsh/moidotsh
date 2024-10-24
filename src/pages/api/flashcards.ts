// flashcards.ts
import { NextApiRequest, NextApiResponse } from "next";
import { readdir, readFile } from "fs/promises";
import path from "path";

// Define the flashcards directory path
const flashcardsDir = path.join(
  process.cwd(),
  "src/assets/flashcards/data/math/precalc/4/1",
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Log the directory path being accessed
    console.log("Attempting to read directory:", flashcardsDir);

    // Check if directory exists and log it
    const files = await readdir(flashcardsDir);
    console.log("Files found in directory:", files);

    let flashcards = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(flashcardsDir, file);
        console.log("Attempting to read file:", filePath);

        // Attempt to read the file and parse the JSON content
        try {
          const data = await readFile(filePath, "utf8");
          console.log("File content for", file, ":", data); // Log the raw file content

          const parsedData = JSON.parse(data);
          console.log(`Successfully parsed file ${file}:`, parsedData);

          flashcards.push(...parsedData);
        } catch (err) {
          console.error(`Error reading or parsing file ${file}:`, err);
          throw new Error(`Failed to process file: ${file}`);
        }
      }
    }

    console.log("Final flashcards array:", flashcards);
    res.status(200).json(flashcards);
  } catch (error) {
    // Provide detailed error output
    console.error("Error in /api/flashcards handler:", error);
    res
      .status(500)
      .json({ error: `Failed to load flashcards: ${error.message}` });
  }
}
