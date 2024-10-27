import { supabase } from "@/utils/supabase";
import { readFileSync, readdirSync } from "fs";
import path from "path";

async function migrateFlashcards() {
  const flashcardsBaseDir = path.join(
    process.cwd(),
    "src/assets/flashcards/data",
  );

  async function processDirectory(category: string, subDir: string) {
    const fullPath = path.join(flashcardsBaseDir, category, subDir);
    const entries = readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await processDirectory(category, path.join(subDir, entry.name));
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        const fileContent = readFileSync(
          path.join(fullPath, entry.name),
          "utf8",
        );
        const cards = JSON.parse(fileContent);

        for (const card of cards) {
          const { data, error } = await supabase.from("flashcards").insert({
            front: card.front,
            back: card.back,
            options: card.options,
            category: category,
            subcategory: subDir.split("/")[0],
            folder: subDir.split("/")[1] || "",
            never_display_first: card.neverDisplayFirst,
            next_question_id: card.nextQuestionId,
            step_number: card.stepNumber,
            total_steps: card.totalSteps,
            source_file: entry.name,
            source_path: subDir,
            user_id: "your-user-id", // You'll need to get this from auth
          });

          if (error) {
            console.error("Error inserting card:", error);
            console.error("Card data:", card);
          }
        }
      }
    }
  }

  // Process each category
  const categories = readdirSync(flashcardsBaseDir);
  for (const category of categories) {
    await processDirectory(category, "");
  }
}
