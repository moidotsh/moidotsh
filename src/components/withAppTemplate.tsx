import React, { useState, useEffect } from "react";
import { X } from "react-feather";
import { useVisibilityStore } from "@/stores/visibilityStore";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { NextRouter } from "next/router";

type Props = {
  getDynamicTitle?: (router?: NextRouter) => JSX.Element;
  router?: NextRouter;
};

const withAppTemplate = <P extends object>(
  WrappedComponent: React.FC<P>,
  appName: string,
  getDynamicTitle?: (router: NextRouter) => JSX.Element,
  fullSize: boolean = false,
) => {
  const WrappedWithTemplate: React.FC<P & Props> = (props) => {
    const { getDynamicTitle, router, ...restProps } = props;
    const [localDynamicTitle, setLocalDynamicTitle] = useState<
      string | JSX.Element | null
    >(null);
    const toggleVisibility = useVisibilityStore((state) => {
      const toggleFuncName = `toggle${appName}`;
      return (state as any)[toggleFuncName];
    });

    // State to track position
    const [currentPosition, setCurrentPosition] = useState<{
      x: number;
      y: number;
    }>({
      x: 0,
      y: 0,
    });

    // State to track the screen size
    const isWideScreen =
      typeof window !== "undefined" && window.innerWidth > 768;

    // Handle random placement logic when the app opens
    useEffect(() => {
      // Set the random Y value to a range of 0 to 50% of the viewport height
      const randomY = Math.random() * (window.innerHeight * 0.5); // Random Y between 0 and 50% of viewport height
      const randomX = Math.random() * (window.innerWidth - 280); // Keep random X to prevent stacking horizontally (200 is approx width of the app)

      setCurrentPosition({ x: randomX, y: randomY });
    }, []);

    // Update the position state when dragging occurs
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
      setCurrentPosition({ x: data.x, y: data.y });
    };

    // Conditional rendering
    const isVisible = useVisibilityStore((state) => {
      const visibilityName = `${appName.toLowerCase()}Visible`;
      return (state as any)[visibilityName];
    });

    if (!isVisible) return null;

    const dynamicTitle = getDynamicTitle ? getDynamicTitle() : null;

    return (
      <Draggable
        handle=".drag-handle"
        position={currentPosition} // Use the updated random position
        onDrag={handleDrag}
      >
        <div className="relative top-2 right-10 z-[2000]">
          <div className="grid grid-cols-11 mt-2 absolute z-[2000] h-[2rem] w-[20rem] self-center bg-white rounded-t">
            <div className="col-span-10 drag-handle flex items-center">
              <p className="ml-3 cursor-default select-none">
                {dynamicTitle || localDynamicTitle || appName}
              </p>
            </div>
            <div
              className="col-span-1 my-auto flex items-center justify-center w-8 h-8 z-[2000]"
              onClick={toggleVisibility}
            >
              <X size={"1rem"} />
            </div>
          </div>
          <div
            className={`p-3 absolute z-[2000] mt-[2rem] w-[20rem] flex self-center ${
              fullSize
                ? "h-[20rem] bg-opacity-90 bg-white" // Large app size
                : "h-[7rem] bg-opacity-30 bg-white" // Small app size
            } rounded-b`}
          >
            {" "}
            <WrappedComponent
              {...(restProps as P)}
              setDynamicTitle={setLocalDynamicTitle}
            />
          </div>
        </div>
      </Draggable>
    );
  };

  WrappedWithTemplate.displayName = `WithAppTemplate(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WrappedWithTemplate;
};

export default withAppTemplate;
