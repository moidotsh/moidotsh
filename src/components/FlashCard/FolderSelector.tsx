import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Chapter = {
  id: string;
  number: number;
  units: Unit[];
};

type Unit = {
  id: string;
  number: number;
  chapter_id: string;
};

type Props = {
  folders: string[];
  selectedFolders: string[];
  onToggleFolderSelection: (folderName: string) => void;
  onStart: () => void;
};

const FolderSelector = ({
  folders,
  selectedFolders,
  onToggleFolderSelection,
  onStart,
}: Props) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChaptersAndUnits = async () => {
      setLoading(true);
      try {
        // First fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("*")
          .order("number");

        if (chaptersError) throw chaptersError;

        // Then fetch units
        const { data: unitsData, error: unitsError } = await supabase
          .from("units")
          .select("*")
          .order("number");

        if (unitsError) throw unitsError;

        // Organize the data
        const organizedChapters = chaptersData.map((chapter) => ({
          ...chapter,
          units: unitsData.filter((unit) => unit.chapter_id === chapter.id),
        }));

        setChapters(organizedChapters);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch chapters and units",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersAndUnits();
  }, []);

  const handleChapterSelect = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    // Get all unit identifiers for this chapter
    const unitIdentifiers = chapter.units.map(
      (unit) => `${chapter.number}.${unit.number}`,
    );

    // Check if all units are currently selected
    const allUnitsSelected = unitIdentifiers.every((id) =>
      selectedFolders.includes(id),
    );

    if (allUnitsSelected) {
      // Deselect all units
      onToggleFolderSelection("deselect-multiple:" + unitIdentifiers.join(","));
    } else {
      // Select all units
      onToggleFolderSelection("select-multiple:" + unitIdentifiers.join(","));
    }
  };

  const handleUnitSelect = (chapterNumber: number, unitNumber: number) => {
    onToggleFolderSelection(`${chapterNumber}.${unitNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading chapters: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full justify-between p-4">
      <h2 className="text-xl mb-4">Choose your units</h2>

      <div className="w-full overflow-y-auto flex-grow">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-6">
            <button
              onClick={() => handleChapterSelect(chapter.id)}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg mb-2 font-semibold"
            >
              Chapter {chapter.number}
            </button>

            <div className="ml-8 grid grid-cols-2 gap-2">
              {chapter.units.map((unit) => {
                const identifier = `${chapter.number}.${unit.number}`;
                const isSelected = selectedFolders.includes(identifier);

                return (
                  <button
                    key={unit.id}
                    onClick={() =>
                      handleUnitSelect(chapter.number, unit.number)
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-green-300 hover:bg-green-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Unit {unit.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-end mt-4">
        <button
          onClick={onStart}
          disabled={selectedFolders.length === 0}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedFolders.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default FolderSelector;
