import React, { useState, useEffect } from "react";
import { X } from "react-feather";
import {
  useVisibilityStore,
  AppletName,
  VisibilityState,
} from "@/stores/visibilityStore";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { NextRouter } from "next/router";

type Props = {
  getDynamicTitle?: (router?: NextRouter) => JSX.Element;
  router?: NextRouter;
};

// Helper types to ensure type safety when accessing store properties
type VisibilityKey<T extends AppletName> = `${Lowercase<T>}Visible`;
type ToggleKey<T extends AppletName> = `toggle${T}`;

const withAppTemplate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  appName: AppletName, // Change this to AppletName to ensure only valid applet names are used
  getDynamicTitle?: (router: NextRouter) => JSX.Element,
  fullSize: boolean = false,
) => {
  const WrappedWithTemplate: React.FC<P & Props> = (props) => {
    const { getDynamicTitle, router, ...restProps } = props;
    const [localDynamicTitle, setLocalDynamicTitle] = useState<
      string | JSX.Element | null
    >(null);
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

    // Get visibility state with proper typing
    const isVisible = useVisibilityStore((state) => {
      const visibilityKey = `${appName.toLowerCase()}Visible` as VisibilityKey<
        typeof appName
      >;
      return state[visibilityKey];
    });

    // Get toggle function with proper typing
    const toggleVisibility = useVisibilityStore((state) => {
      const toggleFuncName = `toggle${appName}` as ToggleKey<typeof appName>;
      return state[toggleFuncName];
    });

    // Set random position when component mounts or becomes visible
    useEffect(() => {
      if (isVisible) {
        const randomY = Math.random() * (window.innerHeight * 0.5);
        const randomX = Math.random() * (window.innerWidth - 280);
        setCurrentPosition({ x: randomX, y: randomY });
      }
    }, [isVisible]);

    // Update position on drag
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
      setCurrentPosition({ x: data.x, y: data.y });
    };

    // Single visibility check
    if (!isVisible) {
      return null;
    }

    const dynamicTitle = getDynamicTitle
      ? getDynamicTitle(router as NextRouter)
      : null;

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
            className={`p-3 absolute z-[2000] mt-[2rem] w-[20rem] flex self-center ${
              fullSize
                ? "h-[20rem] bg-opacity-90 bg-white"
                : "h-[7rem] bg-opacity-30 bg-white"
            } rounded-b`}
          >
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
