// src/components/DynamicScenery.tsx
import dynamic from "next/dynamic";

export const AnimatedBoats = dynamic(() => import("./AnimatedBoats"), {
  ssr: false,
});

export const AnimatedClouds = dynamic(() => import("./AnimatedClouds"), {
  ssr: false,
});
