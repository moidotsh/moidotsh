// Background.tsx

import React, { ReactNode } from "react";
import { theme } from "@/styles/themes";
import { AnimatedBoats, AnimatedClouds } from "@/components/DynamicScenery";
type BackgroundProps = {
  children: ReactNode;
};

const Background = ({ children }: BackgroundProps) => {
  const backgroundStyle = {
    background: `linear-gradient(to top, ${theme.backgroundGradient.start}, ${theme.backgroundGradient.middle}, ${theme.backgroundGradient.end})`,
  };

  return (
    <div
      style={backgroundStyle}
      className="overflow-hidden
    h-2/5 grid grid-cols-11 grid-rows-2"
    >
      <AnimatedClouds />
      {children}
    </div>
  );
};

export default Background;
