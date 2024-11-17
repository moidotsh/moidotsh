import React, { useEffect, useState } from "react";
import { useDynamicSceneryStore } from "@/stores/dynamicSceneryStore";

const AnimatedBoats = () => {
  const { boats, setBoats, updatePositions, isInitialized, setInitialized } =
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
      const centerPosition = screenWidth / 2 - 20;

      const initialBoats = [
        {
          id: 1,
          position: centerPosition,
          speed: 0.002, // Increased by ~250x
          direction: "right" as const,
          size: 20 + Math.random() * 10,
          yOffset: 43,
        },
        {
          id: 2,
          position: -100,
          speed: 0.009, // Slightly different speeds for variety
          direction: "right" as const,
          size: 20 + Math.random() * 10,
          yOffset: 42,
        },
        {
          id: 3,
          position: screenWidth + 100,
          speed: 0.002,
          direction: "left" as const,
          size: 20 + Math.random() * 10,
          yOffset: 44,
        },
      ];

      setBoats(initialBoats);
      setInitialized(true);
    }
  }, [screenWidth, isInitialized, setBoats, setInitialized, isMounted]);

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
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {boats.map((boat) => (
        <div
          key={boat.id}
          className="absolute pointer-events-none"
          style={{
            transform: `translateX(${boat.position}px)`,
            top: `${boat.yOffset}%`,
            willChange: "transform",
          }}
        >
          <svg
            width={boat.size}
            height={boat.size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: boat.direction === "left" ? "scaleX(-1)" : "none",
            }}
          >
            <path
              d="M10,20 L30,20 L25,25 L15,25 Z"
              fill="#2D3748"
              fillOpacity="0.8"
            />
            <path d="M18,10 L18,20 L28,20 Z" fill="#2D3748" fillOpacity="0.8" />
            <path
              d="M10,21 L30,21 L25,26 L15,26 Z"
              fill="#2D3748"
              fillOpacity="0.2"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default AnimatedBoats;
