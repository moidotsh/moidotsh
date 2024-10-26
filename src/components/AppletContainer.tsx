import React from "react";
import { appletRegistry } from "@/utils/appletUtils";
import { useVisibilityStore, AppletName } from "@/stores/visibilityStore";

const AppletContainer = () => {
  const visibilityStates = useVisibilityStore((state) => {
    const states: Record<string, boolean> = {};
    appletRegistry.forEach((applet) => {
      const visibilityKey =
        `${applet.name.toLowerCase()}Visible` as `${Lowercase<AppletName>}Visible`;
      states[applet.name] = state[visibilityKey];
    });
    return states;
  });

  return (
    <>
      {appletRegistry.map((applet) => {
        const AppletComponent = applet.component;
        const isVisible = visibilityStates[applet.name];

        if (!isVisible) return null;
        return <AppletComponent key={applet.name} />;
      })}
    </>
  );
};

export default AppletContainer;
