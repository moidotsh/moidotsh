import React, { ReactNode } from "react";
import {
  useVisibilityStore,
  AppletName,
  VisibilityState,
} from "@/stores/visibilityStore";
import withAppTemplate from "@/components/withAppTemplate";
import { NextRouter } from "next/router";

export type AppletDefinition = {
  name: AppletName;
  displayName: string;
  getIcon: () => ReactNode;
  component: React.ComponentType<any>;
  fullSize?: boolean;
  getDynamicTitle?: (router?: NextRouter) => JSX.Element;
  showInDock?: boolean;
};

type DynamicVisibilityKey<T extends AppletName> = `${Lowercase<T>}Visible`;
type DynamicToggleKey<T extends AppletName> = `toggle${T}`;

export const appletRegistry: AppletDefinition[] = [];

export function registerApplet(applet: AppletDefinition) {
  const appletWithDefaults = {
    showInDock: true,
    ...applet,
  };
  appletRegistry.push(appletWithDefaults);
}
