// src/components/FlashCard/CategorySelector.tsx
import React from "react";
import { Category } from "@/assets/flashcards/flashcardCategories";

type Props = {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
};

const CategorySelector = ({ categories, onSelectCategory }: Props) => {
  return (
    <div className="flex flex-wrap justify-center">
      {categories.map((categoryName) => (
        <button
          key={categoryName}
          className="p-2 rounded m-2 bg-gray-300"
          onClick={() => onSelectCategory(categoryName)}
        >
          {categoryName}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
