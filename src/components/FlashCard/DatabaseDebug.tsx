// src/components/FlashCard/DatabaseDebug.tsx
import React, { useEffect, useState } from "react";
import { testDatabaseContent } from "@/utils/flashcardUtils";
import { supabase } from "@/utils/supabase";

const DatabaseDebug = () => {
  const [dbContent, setDbContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkFlashcardPaths = async () => {
    const { data, error } = await supabase
      .from("flashcard_paths")
      .select("*")
      .limit(5);

    console.log("Flashcard paths:", {
      data,
      error: error?.message,
    });

    return data;
  };

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const content = await testDatabaseContent();
        setDbContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    checkDatabase();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!dbContent) {
    return <div>Loading database content...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold">Database Content</h3>
      <div className="mt-2">
        <h4>Categories ({dbContent.categories?.length ?? 0}):</h4>
        <pre className="bg-white p-2 rounded mt-1">
          {JSON.stringify(dbContent.categories, null, 2)}
        </pre>
      </div>
      <div className="mt-2">
        <h4>Sample Flashcards:</h4>
        <pre className="bg-white p-2 rounded mt-1">
          {JSON.stringify(dbContent.sampleFlashcards, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DatabaseDebug;
