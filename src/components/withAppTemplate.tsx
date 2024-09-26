//withAppTemplate.tsx
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
  fullSize: boolean = false
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

    // State to trak position
    const [currentPosition, setCurrentPosition] = useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });

    


    const isWideScreen = typeof window !== "undefined" && window.innerWidth > 768;
    const appWidth = 20; // rem
    const appHeight = fullSize ? 7 : 20; // rem 



    useEffect(() => {
      // A conversion needs to be done here to convert rem (which the app template
      // is rendered in) to pixels which javascript can use to programmatically
      // center the rendered apps for small viewers
      // in a useEffect since it's using the document
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

      const appWidthInPixels = appWidth * rootFontSize;
      const appHeightInPixels = appHeight * rootFontSize;
      
      // I had to create these offset values because I realized the reason
      // my centering math wasn't working is because there's some remnant hidden
      // overflow going on from generating the mountains 
      const xOffset = 40;
      const yOffset = -15; 

      // Generate random x and y coordinates within the window's dimensions
      // But if it's a smaller viewport, put it within certain constrains
      const randomX = isWideScreen ? Math.floor(Math.random() * (window.innerWidth - 200)) : xOffset + ((window.innerWidth - appWidthInPixels) / 2); // 200 is the approx width of the app
      const randomY = isWideScreen ? Math.floor(Math.random() * (window.innerHeight - 200)) : yOffset + -(yOffset); // For consistency's sake I measured the offset to the point where they're touching the edge 

      console.log("rootFontSize", rootFontSize)
      console.log("appWidthInPixels", appWidthInPixels);
      console.log("appHeightInPixels", appHeightInPixels);
      console.log("window.innerWidth", window.innerWidth);

      setCurrentPosition({ x: randomX, y: randomY });
    }, []); // Empty dependency array ensures this runs only once when the component mounts

// Come back to this //
      useEffect(() => {
        console.log("isWideScreen", isWideScreen)
        }, [isWideScreen])

    // Update the position state when dragging occurs.
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
      setCurrentPosition({ x: data.x, y: data.y });
      console.log(currentPosition)
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
        position={currentPosition}
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
            className={`p-3 absolute z-[2000] mt-[2rem] w-[20rem] flex self-center ${fullSize
              ? "h-[20rem] bg-opacity-90 bg-white" // 3x taller and fully opaque for full-size apps
              : "h-[7rem] bg-opacity-30 bg-white" // Standard size and opacity
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

  WrappedWithTemplate.displayName = `WithAppTemplate(${WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

  return WrappedWithTemplate;
};

export default withAppTemplate;
