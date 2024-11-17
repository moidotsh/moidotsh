// AppletContainer.tsx
import React from "react";
import { appletRegistry } from "@/utils/appletUtils";
import { useVisibilityStore } from "@/stores/visibilityStore";

const AppletContainer = () => {
  const visibilityStates = useVisibilityStore((state) => ({
    explorerVisible: state.explorerVisible,
    terminalVisible: state.terminalVisible,
    musicVisible: state.musicVisible,
    browserVisible: state.browserVisible,
    flashcardsVisible: state.flashcardsVisible,
    chatVisible: state.chatVisible,
  }));

  console.log("AppletContainer render - visibility states:", visibilityStates);
  console.log("AppletContainer - registered applets:", appletRegistry);

  return (
    <>
      {appletRegistry.map((applet) => {
        const AppletComponent = applet.component;
        const visibilityKey = `${applet.name.toLowerCase()}Visible`;
        const isVisible =
          visibilityStates[visibilityKey as keyof typeof visibilityStates];

        console.log(`Applet ${applet.name} visibility:`, isVisible);

        if (!isVisible) {
          console.log(`Skipping render of ${applet.name} - not visible`);
          return null;
        }

        console.log(`Rendering ${applet.name}`);
        return <AppletComponent key={applet.name} />;
      })}
    </>
  );
};

export default AppletContainer;
