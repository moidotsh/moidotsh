import React from "react";
import { appletRegistry } from "@/utils/appletUtils";
import { useVisibilityStore } from "@/stores/visibilityStore";

const AppletContainer = () => {
  return (
    <>
      {appletRegistry.map((applet) => {
        const AppletComponent = applet.component;
        const isVisible = useVisibilityStore(
          (state) => state[`${applet.name.toLowerCase()}Visible` as any],
        );

        if (!isVisible) return null;
        return <AppletComponent key={applet.name} />;
      })}
    </>
  );
};

export default AppletContainer;
