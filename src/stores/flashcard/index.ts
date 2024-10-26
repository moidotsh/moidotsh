// src/stores/flashcard/index.ts
export { useNavigationStore } from "./navigationStore";
export { useProgressStore } from "./progressStore";
export { useCardStore } from "./cardStore";

// a hook that combines all stores if needed
// export const useFlashcardStores = () => {
//   const navigation = useNavigationStore();
//   const progress = useProgressStore();
//   const card = useCardStore();

//   return {
//     navigation,
//     progress,
//     card,
//   };
// };
