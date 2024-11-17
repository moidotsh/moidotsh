import React, { useState, useEffect } from "react";
import { useVisibilityStore } from "@/stores/visibilityStore";

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
  const toggleChat = useVisibilityStore((state) => state.toggleChat);

  useEffect(() => {
    const initialBoats: Boat[] = [
      createBoat(1, "right", 42),
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
      yOffset: yOffset + (Math.random() * 2 - 1),
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

  const handleBoatClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Boat clicked"); // Debug log
    toggleChat();
    console.log("Chat visibility:", useVisibilityStore.getState().chatVisible); // Debug log
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {boats.map((boat) => (
        <div
          key={boat.id}
          className="absolute cursor-pointer"
          style={{
            transform: `translateX(${boat.position}px)`,
            top: `${boat.yOffset}%`,
            willChange: "transform",
            zIndex: 50, // Make sure boats are clickable
          }}
          onClick={handleBoatClick}
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
