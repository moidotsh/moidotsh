import React, { ReactNode } from "react";
import { useVisibilityStore } from "@/stores/visibilityStore";
import withAppTemplate from "@/components/withAppTemplate";
import { NextRouter } from "next/router";

export type AppletDefinition = {
  name: string;
  displayName: string; // Added displayName
  getIcon: () => ReactNode;
  component: React.ComponentType<any>;
  fullSize?: boolean;
  getDynamicTitle?: (router?: NextRouter) => JSX.Element;
};

export function createApplet(
  Component: React.ComponentType<any>,
  name: string,
  displayName: string, // Added displayName parameter
  options?: {
    fullSize?: boolean;
    getDynamicTitle?: (router?: NextRouter) => JSX.Element;
  },
) {
  // Add to visibility store
  useVisibilityStore.setState((state) => {
    const visibilityKey = `${name.toLowerCase()}Visible`;
    const toggleKey = `toggle${name}`;

    return {
      ...state,
      [visibilityKey]: false,
      [toggleKey]: () =>
        useVisibilityStore.setState((s) => ({
          [visibilityKey]: !s[visibilityKey],
        })),
    };
  });

  // Return wrapped component
  return withAppTemplate(
    Component,
    displayName, // Use displayName for UI
    options?.getDynamicTitle,
    options?.fullSize,
  );
}

// Registry of applets for the dock
export const appletRegistry: AppletDefinition[] = [];

// Function to register an applet
export function registerApplet(applet: AppletDefinition) {
  appletRegistry.push(applet);
}
