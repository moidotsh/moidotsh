import React, { useState, useEffect } from "react";
import Image from "next/image";
import my_portrait from "../../../public/pages/arman.jpg";

type Props = {};

export default function HomePage({}: Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [kirbyFrame, setKirbyFrame] = useState(0);
  const [kirbyPosition, setKirbyPosition] = useState(10);
  const [direction, setDirection] = useState(-1);

  const messageEmojiPairs = [
    { message: "Let's Build Together!", emoji: "🚀" },
    { message: "React, Next, Tailwind", emoji: "💻" },
    { message: "Mobile App Dev", emoji: "📱" },
    { message: "Git Guru", emoji: "🔗" },
    { message: "Linux Enthusiast", emoji: "🐧" },
    { message: "Fitness Buff", emoji: "💪" },
    { message: "System Tinkerer", emoji: "🛠️" },
    { message: "Multi-disciplinary", emoji: "🌈" },
    { message: "Vim + LaTeX", emoji: "✍️" },
    { message: "BunJS", emoji: "🍞"},
    { message: "Typescript", emoji: "👨🏽‍💻"}
  ];

  const kirbyFrames = [
    "`           ",
    "'           ",
    "-           ",
    ",           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    "..          ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    "..          ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    "..          ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    "..          ",
    ".          ?",
    ".           ",
    ".          ?",
    ".          <",
    ".         <(",
    ".        <(O",
    ".       <(O.",
    ".      !<(O.",
    ".       <(O.",
    ".      !<(O.",
    ".       <(O.",
    ".      !<(O.",
    ".       <(O.",
    ".        <(O",
    ".         <(",
    ".          <",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".           ",
    ".          <",
    ".         <(",
    ".        <('",
    ".       <('o",
    ".      <('o'",
    ".     <('o'<",
    ".    <('o'<)",
    ".   <('o'<) ",
    ".  <('o'<)  ",
    ". <('o'<)   ",
    ".<('o'<)    ",
    ".<('o'<)    ",
    ".<(^o^<)    ",
    ".<(^o^<)    ",
    "'^(^o^)^    ",
    ".-(^o^)-    ",
    "'^(^o^)^    ",
    "(>.'v')>    ",
    "(>.'v')>   ",
    "(>.'v')>  ",
    "(>.'v')> ",
    "(>.'v')>",
    "(>.'v')",
    "(>.'v'",
    "(>.'v",
    "(>.'",
    "(>.",
    "(>",
    "(",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setInterval(() => {
      setKirbyFrame((prevFrame) => (prevFrame + 1) % kirbyFrames.length);
      setKirbyPosition((prevPosition) => {
        const newPosition = prevPosition + direction;
        if (newPosition <= 0 || newPosition >= 10) {
          setDirection(-direction);
        }
        // Change the message when Kirby raises his arms
        if (kirbyFrames[kirbyFrame] === "") {
          setMessageIndex(
            (prevIndex) => (prevIndex + 1) % messageEmojiPairs.length
          );
        }
        return newPosition;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [direction, kirbyFrame]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 h-full pr-2 pl-2 pt-2 bg-gray-100">
        {/* Top Left Column */}
        <div className="col-span-1 bg-white p-2 rounded-lg flex flex-col items-center justify-center">
          <Image
            src={my_portrait}
            alt="Arman's Portrait"
            width={100}
            height={100}
          />
          <p className="text-xs text-gray-600">That&apos;s Me!</p>
        </div>

        {/* Top Right Column */}
        <div className="col-span-1 bg-white p-2 rounded-lg flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Hi, I&apos;m Arman!
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 h-full pl-2 pr-2 pt-2 pb-2 bg-gray-100">
        {/* Bottom Left Column */}
        <div className="col-span-1 bg-white p-2 rounded-lg flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-800">
            {messageEmojiPairs[messageIndex].emoji}
          </div>
          <p className="text-xs text-gray-600">
            {messageEmojiPairs[messageIndex].message}
          </p>
        </div>

        {/* Bottom Right Column */}
        <div className="col-span-1 bg-white p-2 rounded-lg flex flex-col text-right">
          <div className="flex-grow"></div>
          <div className="flex justify-end overflow-hidden">
            {Array.from({ length: 100 }, (_, i) => i).map((i) => (
              <div key={i} className="flex-none w-[1/10]">
                {i === kirbyPosition ? (
                  <pre>{kirbyFrames[kirbyFrame]}</pre>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex-grow"></div>
        </div>
      </div>
    </>
  );
}
