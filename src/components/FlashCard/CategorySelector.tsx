import React from "react";

type Props = {
  categories: string[];
  onSelectCategory: (category: string) => void;
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
