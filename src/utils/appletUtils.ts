import React, { ReactNode } from "react";
import {
  useVisibilityStore,
  AppletName,
  VisibilityState,
} from "@/stores/visibilityStore";
import withAppTemplate from "@/components/withAppTemplate";
import { NextRouter } from "next/router";

export type AppletDefinition = {
  name: AppletName; // Now using our AppletName type
  displayName: string;
  getIcon: () => ReactNode;
  component: React.ComponentType<any>;
  fullSize?: boolean;
  getDynamicTitle?: (router?: NextRouter) => JSX.Element;
};

type DynamicVisibilityKey<T extends string> = `${Lowercase<T>}Visible`;
type DynamicToggleKey<T extends string> = `toggle${T}`;

export function createApplet(
  Component: React.ComponentType<any>, // Accept any React component type
  name: AppletName,
  displayName: string,
  options?: {
    fullSize?: boolean;
    getDynamicTitle?: (router?: NextRouter) => JSX.Element;
  },
) {
  // Add to visibility store
  useVisibilityStore.setState((state) => {
    const visibilityKey =
      `${name.toLowerCase()}Visible` as DynamicVisibilityKey<typeof name>;
    const toggleKey = `toggle${name}` as DynamicToggleKey<typeof name>;

    return {
      ...state,
      [visibilityKey]: false,
      [toggleKey]: () =>
        useVisibilityStore.setState((s) => ({
          [visibilityKey]: !s[visibilityKey as keyof VisibilityState],
        })),
    } as Partial<VisibilityState>;
  });

  // Return wrapped component - use type assertion if needed
  return withAppTemplate(
    Component as React.FC<any>, // Type assertion to match withAppTemplate's expected type
    displayName,
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
