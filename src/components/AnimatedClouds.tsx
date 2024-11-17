import React, { useState, useEffect } from "react";

interface Cloud {
  id: number;
  position: number;
  speed: number;
  size: number;
  yOffset: number;
}

const AnimatedClouds = () => {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;
    const initialClouds: Cloud[] = [
      createCloud(1, 3, screenWidth + 100),
      createCloud(2, 8, screenWidth * 0.7),
      createCloud(3, 5, screenWidth * 0.3),
      createCloud(4, 6, -200),
    ];
    setClouds(initialClouds);
  }, []);

  function createCloud(id: number, yOffset: number, initialX: number): Cloud {
    return {
      id,
      position: initialX,
      speed: 0.2 + Math.random() * 0.1, // Slower, gentler movement
      size: 250 + Math.random() * 100, // Large but not overwhelming
      yOffset: yOffset + Math.random() * 3,
    };
  }

  useEffect(() => {
    let animationFrame: number;
    const screenWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;

    const animate = () => {
      setClouds((prevClouds) => {
        return prevClouds.map((cloud) => {
          let newPosition = cloud.position - cloud.speed;

          if (newPosition < -300) {
            return {
              ...cloud,
              position: screenWidth + 100,
              speed: 0.2 + Math.random() * 0.1,
              size: 250 + Math.random() * 100,
              yOffset: Math.random() * 8 + 2,
            };
          }

          return { ...cloud, position: newPosition };
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
            {/* Simple, soft cloud shape */}
            <path
              d="
                M 20 40
                Q 0 40 0 25
                Q 0 10 20 15
                Q 30 0 50 5
                Q 65 0 80 10
                Q 100 10 100 25
                Q 100 40 80 40
                Q 65 45 50 40
                Q 35 45 20 40
              "
              fill="white"
              fillOpacity="0.25"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default AnimatedClouds;
