import React, { useEffect, useState } from "react";
import { useDynamicSceneryStore } from "@/stores/dynamicSceneryStore";
import { generateCloudLayers } from "@/utils/cloudUtils";

const AnimatedClouds = () => {
  const { clouds, setClouds, updatePositions, isInitialized, setInitialized } =
    useDynamicSceneryStore();
  const [isMounted, setIsMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1000);

  useEffect(() => {
    setIsMounted(true);
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isInitialized && isMounted) {
      const initialClouds = [
        {
          id: 1,
          position: screenWidth + 100,
          speed: 0.02,
          size: 250 + Math.random() * 100,
          yOffset: 3 + Math.random() * 3,
          layers: generateCloudLayers(), // Using imported function
        },
        {
          id: 2,
          position: screenWidth * 0.7,
          speed: 0.015,
          size: 250 + Math.random() * 100,
          yOffset: 8 + Math.random() * 3,
          layers: generateCloudLayers(),
        },
        {
          id: 3,
          position: screenWidth * 0.3,
          speed: 0.025,
          size: 250 + Math.random() * 100,
          yOffset: 5 + Math.random() * 3,
          layers: generateCloudLayers(),
        },
        {
          id: 4,
          position: -200,
          speed: 0.018,
          size: 250 + Math.random() * 100,
          yOffset: 6 + Math.random() * 3,
          layers: generateCloudLayers(),
        },
      ];

      setClouds(initialClouds);
      setInitialized(true);
    }
  }, [screenWidth, isInitialized, setClouds, setInitialized, isMounted]);

  useEffect(() => {
    if (!isInitialized || !isMounted) return;

    let animationFrame: number;
    const animate = () => {
      updatePositions(screenWidth);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [updatePositions, screenWidth, isInitialized, isMounted]);

  if (!isMounted) return null;

  return (
    <div
      className="absolute inset-0 w-full overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            transform: `translateX(${cloud.position}px)`,
            top: `${cloud.yOffset}%`,
            willChange: "transform",
          }}
        >
          <svg
            width={cloud.size}
            height={cloud.size * 0.5}
            viewBox="0 0 100 50"
            style={{ overflow: "visible" }}
          >
            {cloud.layers.map((layer, index) => (
              <path
                key={index}
                d={layer.path}
                fill="white"
                fillOpacity={layer.opacity}
                transform={layer.transform}
                style={{
                  filter: "blur(1px)",
                }}
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
};

export default AnimatedClouds;
