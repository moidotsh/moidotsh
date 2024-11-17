import React, { useState, useEffect } from "react";

interface Boat {
  id: number;
  position: number;
  speed: number;
  direction: "left" | "right";
  size: number;
  yOffset: number;
}

const AnimatedBoats = () => {
  const [boats, setBoats] = useState<Boat[]>([]);

  useEffect(() => {
    const initialBoats: Boat[] = [
      createBoat(1, "right", 42), // Adjusted to middle lake section
      createBoat(2, "left", 44),
      createBoat(3, "right", 43),
    ];
    setBoats(initialBoats);
  }, []);

  function createBoat(
    id: number,
    direction: "left" | "right",
    yOffset: number,
  ): Boat {
    return {
      id,
      position: direction === "right" ? -100 : window.innerWidth + 100,
      speed: 0.05 + Math.random() * 0.1,
      direction,
      size: 20 + Math.random() * 10,
      yOffset: yOffset + (Math.random() * 2 - 1), // Small vertical variation
    };
  }

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setBoats((prevBoats) =>
        prevBoats.map((boat) => {
          let newPosition =
            boat.position +
            (boat.direction === "right" ? boat.speed : -boat.speed);

          if (
            boat.direction === "right" &&
            newPosition > window.innerWidth + 100
          ) {
            return createBoat(boat.id, "right", boat.yOffset);
          } else if (boat.direction === "left" && newPosition < -100) {
            return createBoat(boat.id, "left", boat.yOffset);
          }

          return { ...boat, position: newPosition };
        }),
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
            {/* Original boat silhouette */}
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
