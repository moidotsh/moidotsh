import React, { useState, useCallback } from "react";
import { useVisibilityStore, AppletName } from "@/stores/visibilityStore";
import { appletRegistry, AppletDefinition } from "@/utils/appletUtils";

const AppDock = () => {
  const [isTouched, setIsTouched] = useState<number | null>(null);
  let timeout: any = null;

  const toggleFns = useVisibilityStore((state) => {
    const fns: Record<string, () => void> = {};
    appletRegistry.forEach((applet) => {
      fns[applet.name] = state[`toggle${applet.name as AppletName}`];
    });
    return fns;
  });

  const visibilityStates = useVisibilityStore((state) => {
    const states: Record<string, boolean> = {};
    appletRegistry.forEach((applet) => {
      states[applet.name] =
        state[
          `${applet.name.toLowerCase()}Visible` as `${Lowercase<AppletName>}Visible`
        ];
    });
    return states;
  });

  const handleIconClick = useCallback(
    (applet: AppletDefinition, index: number) => {
      const toggleFn = toggleFns[applet.name];
      if (toggleFn) {
        toggleFn();
      }

      setIsTouched(index);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsTouched(null);
      }, 500);
    },
    [toggleFns],
  );

  // Filter applets for dock display
  const dockApplets = appletRegistry.filter((applet) => {
    // Only show essential apps on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return (
        applet.showInDock &&
        ["Terminal", "Explorer", "Flashcards"].includes(applet.name)
      );
    }
    return applet.showInDock;
  });

  return (
    <div className="absolute w-full flex bottom-10 pt-20 justify-center overflow-y-hidden">
      <div className="z-[2000]">
        <div className="w-[60vh] text-center">
          <ul className="list-none flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-2">
            {dockApplets.map((applet, index) => {
              const isVisible = visibilityStates[applet.name];

              return (
                <li
                  key={index}
                  className={`flex flex-col items-center w-16 sm:w-20 relative cursor-default`}
                  onClick={() => handleIconClick(applet, index)}
                >
                  <div
                    className={`bg-white w-14 h-14 sm:w-20 sm:h-20 flex flex-col justify-center items-center rounded transform transition-transform will-change-transform ${
                      isTouched === index ? "-translate-y-5" : ""
                    }`}
                  >
                    <div className="scale-75 sm:scale-100">
                      {applet.getIcon()}
                    </div>
                    <span className="select-none text-xs sm:text-sm">
                      {applet.displayName.toLowerCase()}
                    </span>
                  </div>
                  <div
                    style={{
                      background: isVisible ? "#ffffff" : "transparent",
                    }}
                    className="absolute bottom-[-5px] left-[50%] translate-x-[-50%] w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                  ></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppDock;
