import React, { useState, useCallback } from "react";
import { useVisibilityStore, AppletName } from "@/stores/visibilityStore";
import { appletRegistry, AppletDefinition } from "@/utils/appletUtils";

function AppDock() {
  const [isTouched, setIsTouched] = useState<number | null>(null);
  let timeout: any = null;

  // Move the store access outside the callback
  const toggleFns = useVisibilityStore((state) => {
    const fns: Record<string, () => void> = {};
    appletRegistry.forEach((applet) => {
      fns[applet.name] = state[`toggle${applet.name as AppletName}`];
    });
    return fns;
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

  // Use hook in the component body, not in map callback
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

  return (
    <div className="absolute w-full flex bottom-0 pt-20 justify-center overflow-y-hidden">
      <div className="z-[2000]">
        <div className="w-[60vh] text-center">
          <ul className="list-none flex justify-evenly items-center">
            {appletRegistry.map((applet, index) => {
              const isVisible = visibilityStates[applet.name];

              return (
                <li
                  key={index}
                  className={`flex flex-col items-center bottom-10 w-20 relative cursor-default`}
                  onClick={() => handleIconClick(applet, index)}
                >
                  <div
                    className={`bg-white w-20 h-20 flex flex-col justify-center items-center rounded transform transition-transform will-change-transform ${
                      isTouched === index ? "-translate-y-5" : ""
                    }`}
                  >
                    {applet.getIcon()}
                    <span className="select-none">
                      {applet.displayName.toLowerCase()}
                    </span>
                  </div>
                  <div
                    style={{
                      background: isVisible ? "#ffffff" : "transparent",
                    }}
                    className="absolute bottom-[-5px] left-[50%] translate-x-[-50%] w-3 h-3 rounded-full"
                  ></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AppDock;
