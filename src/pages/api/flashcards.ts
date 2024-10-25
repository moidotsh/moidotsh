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
    console.log("Attempting to read directory:", flashcardsDir);

    // Read all files in the directory
    const files = await readdir(flashcardsDir);
    console.log("Total files in directory:", files.length);
    console.log("Files found in directory:", files);

    let flashcards = [];
    let skippedFiles = [];
    let errorFiles = [];

    // Loop through each file in the directory
    for (const file of files) {
      console.log("Processing file:", file);

      if (file.endsWith(".json")) {
        const filePath = path.join(flashcardsDir, file);
        console.log("Attempting to read file:", filePath);

        try {
          // Read and parse the JSON file
          const data = await readFile(filePath, "utf8");
          console.log("File content for", file, ":", data);

          // Check if JSON is valid and log any issues
          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch (jsonError) {
            console.error(
              `JSON parse error in file ${file}:`,
              jsonError.message,
            );
            errorFiles.push(file);
            continue;
          }

          if (!Array.isArray(parsedData)) {
            console.error(
              `Invalid format (not an array) in file ${file}. Skipping.`,
            );
            errorFiles.push(file);
            continue;
          }

          console.log(`Successfully parsed file ${file}:`, parsedData);

          flashcards.push(...parsedData);
        } catch (err) {
          // Log error and continue with the rest of the files
          console.error(`Error reading or parsing file ${file}:`, err.message);
          errorFiles.push(file);
          continue;
        }
      } else {
        console.log(`Skipping non-JSON file: ${file}`);
        skippedFiles.push(file);
      }
    }

    // Log skipped and error files for debugging
    console.log("Skipped non-JSON files:", skippedFiles);
    console.log("Files with errors:", errorFiles);

    // If no flashcards were loaded
    if (flashcards.length === 0) {
      throw new Error("No valid flashcards found in directory.");
    }

    console.log("Final flashcards array:", flashcards);
    res.status(200).json(flashcards);
  } catch (error) {
    // Provide detailed error output
    console.error("Error in /api/flashcards handler:", error.message);
    res
      .status(500)
      .json({ error: `Failed to load flashcards: ${error.message}` });
  }
}
