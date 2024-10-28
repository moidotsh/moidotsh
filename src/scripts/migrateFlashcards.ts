// src/scripts/migrateFlashcards.ts
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

function extractLessonFromFilename(filename: string): string {
  const parts = filename.replace(".json", "").split("_");
  return parts.slice(2).join("_");
}

async function ensureCategory(name: string): Promise<string> {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .single();

  if (error || !data) {
    const { data: newCategory, error: insertError } = await supabase
      .from("categories")
      .insert({ name })
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newCategory.id;
  }

  return data.id;
}

async function ensureSubcategory(
  categoryId: string,
  name: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id")
    .eq("category_id", categoryId)
    .eq("name", name)
    .single();

  if (error || !data) {
    const { data: newSubcategory, error: insertError } = await supabase
      .from("subcategories")
      .insert({ category_id: categoryId, name })
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newSubcategory.id;
  }

  return data.id;
}

async function ensureChapter(
  subcategoryId: string,
  number: number,
): Promise<string> {
  const { data, error } = await supabase
    .from("chapters")
    .select("id")
    .eq("subcategory_id", subcategoryId)
    .eq("number", number)
    .single();

  if (error || !data) {
    const { data: newChapter, error: insertError } = await supabase
      .from("chapters")
      .insert({ subcategory_id: subcategoryId, number })
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newChapter.id;
  }

  return data.id;
}

async function ensureUnit(chapterId: string, number: number): Promise<string> {
  const { data, error } = await supabase
    .from("units")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("number", number)
    .single();

  if (error || !data) {
    const { data: newUnit, error: insertError } = await supabase
      .from("units")
      .insert({ chapter_id: chapterId, number })
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newUnit.id;
  }

  return data.id;
}

async function ensureLesson(unitId: string, name: string): Promise<string> {
  const { data, error } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unitId)
    .eq("name", name)
    .single();

  if (error || !data) {
    const { data: newLesson, error: insertError } = await supabase
      .from("lessons")
      .insert({ unit_id: unitId, name })
      .select("id")
      .single();

    if (insertError) throw insertError;
    return newLesson.id;
  }

  return data.id;
}

async function migrateFlashcards() {
  console.log("Starting flashcard migration...");

  const flashcardsBaseDir = path.join(
    process.cwd(),
    "src/assets/flashcards/data",
  );
  console.log("Base directory:", flashcardsBaseDir);

  async function processDirectory(
    basePath: string,
    category: string,
    subDir: string = "",
  ) {
    const fullPath = path.join(basePath, category, subDir);
    console.log("Processing directory:", fullPath);

    try {
      const entries = readdirSync(fullPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = path.join(fullPath, entry.name);

        if (entry.isDirectory()) {
          await processDirectory(
            basePath,
            category,
            path.join(subDir, entry.name),
          );
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
          console.log("Processing file:", entry.name);

          try {
            const fileContent = readFileSync(entryPath, "utf8");
            const cleanedContent = fileContent.replace(
              /\/\*[\s\S]*?\*\/|\/\/.*/g,
              "",
            );
            const cards = JSON.parse(cleanedContent);

            // Parse path components
            const pathParts = subDir.split(path.sep);
            const subcategoryName = pathParts[0] || null;
            const chapterNumber = parseInt(pathParts[1]) || null;
            const unitNumber = parseInt(pathParts[2]) || null;
            const lessonName = extractLessonFromFilename(entry.name);

            // Ensure hierarchy exists
            const categoryId = await ensureCategory(category);
            const subcategoryId = subcategoryName
              ? await ensureSubcategory(categoryId, subcategoryName)
              : null;
            const chapterId =
              subcategoryId && chapterNumber
                ? await ensureChapter(subcategoryId, chapterNumber)
                : null;
            const unitId =
              chapterId && unitNumber
                ? await ensureUnit(chapterId, unitNumber)
                : null;
            const lessonId =
              unitId && lessonName
                ? await ensureLesson(unitId, lessonName)
                : null;

            if (!lessonId) {
              console.log("Skipping file due to incomplete path:", entry.name);
              continue;
            }

            console.log("Processing cards for lesson:", lessonName);

            // Get existing cards for this lesson to check for duplicates
            const { data: existingCards } = await supabase
              .from("flashcards")
              .select("front, source_file, source_path")
              .eq("lesson_id", lessonId);

            for (const card of cards) {
              // Check if this card already exists
              const isDuplicate = existingCards?.some(
                (existingCard) =>
                  existingCard.front === card.front &&
                  existingCard.source_file === entry.name &&
                  existingCard.source_path === subDir,
              );

              if (isDuplicate) {
                console.log(
                  "Skipping duplicate card:",
                  card.front.substring(0, 30) + "...",
                );
                continue;
              }

              // Insert new card
              const { data, error } = await supabase.from("flashcards").insert({
                lesson_id: lessonId,
                front: card.front,
                back: card.back,
                options: card.options,
                next_question_id: card.nextQuestionId,
                step_number: card.stepNumber,
                total_steps: card.totalSteps,
                never_display_first: card.neverDisplayFirst,
                source_file: entry.name,
                source_path: subDir,
              });

              if (error) {
                console.error("Error inserting card:", error);
                console.error("Card data:", card);
              } else {
                console.log("Successfully inserted new card");
              }
            }
          } catch (error) {
            console.error(`Error processing ${entry.name}:`, error);
            if (error instanceof SyntaxError) {
              console.error("JSON syntax error in file");
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error accessing directory ${fullPath}:`, error);
    }
  }

  try {
    const categories = readdirSync(flashcardsBaseDir);
    for (const category of categories) {
      console.log("Processing category:", category);
      await processDirectory(flashcardsBaseDir, category);
    }
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Add a cleanup function to remove orphaned flashcards
async function cleanupOrphanedFlashcards() {
  console.log("Cleaning up orphaned flashcards...");

  const { data: orphanedCards, error } = await supabase
    .from("flashcards")
    .delete()
    .is("lesson_id", null)
    .select();

  if (error) {
    console.error("Error cleaning up orphaned cards:", error);
  } else {
    console.log(`Removed ${orphanedCards?.length || 0} orphaned flashcards`);
  }
}

// Main execution
migrateFlashcards()
  .then(cleanupOrphanedFlashcards)
  .then(() => {
    console.log("Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
