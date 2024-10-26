import React, { useState } from "react";
import { useVisibilityStore, AppletName } from "@/stores/visibilityStore";
import { appletRegistry, AppletDefinition } from "@/utils/appletUtils";

function AppDock() {
  const [isTouched, setIsTouched] = useState<number | null>(null);
  let timeout: any = null;

  const handleIconClick = (applet: AppletDefinition, index: number) => {
    const toggleFn =
      useVisibilityStore.getState()[`toggle${applet.name as AppletName}`];
    if (toggleFn) {
      toggleFn();
    }

    setIsTouched(index);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsTouched(null);
    }, 500);
  };

  return (
    <div className="absolute w-full flex bottom-0 pt-20 justify-center overflow-y-hidden">
      <div className="z-[2000]">
        <div className="w-[60vh] text-center">
          <ul className="list-none flex justify-evenly items-center">
            {appletRegistry.map((applet, index) => {
              const isVisible = useVisibilityStore(
                (state) =>
                  state[
                    `${applet.name.toLowerCase()}Visible` as DynamicVisibilityKey<
                      Lowercase<AppletName>
                    >
                  ],
              );

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
