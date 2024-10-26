// BrowserApp.tsx
import BrowserAppAddressBar from "./BrowserAppAddressBar";
import LoadingKirby from "./LoadingKirby";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import React from "react";

type BrowserAppProps = {
  children?: JSX.Element;
};

const BrowserApp = ({ children }: BrowserAppProps) => {
  // Get all state at once for logging
  const state = useVisibilityStore((state) => ({
    content: state.browserContent,
    loading: state.browserLoading,
    title: state.browserTitle,
    browserVisible: state.browserVisible,
  }));

  console.log("BrowserApp render state:", state);

  // Early return if not visible
  if (!state.browserVisible) {
    console.log("BrowserApp - returning null due to !browserVisible");
    return null;
  }

  const getSubstringAfterFirstSlash = (str: string) => {
    const index = str.indexOf("/");
    return index !== -1 ? str.substring(index + 1) : "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white w-[19rem] pr-2">
        <BrowserAppAddressBar url={getSubstringAfterFirstSlash(state.title)} />
      </div>
      <div className="w-full overflow-y-auto flex-grow">
        <div className="pt-1 pr-2">
          {state.loading ? <LoadingKirby /> : state.content || children}
        </div>
      </div>
    </div>
  );
};

// Debug wrapper to log when component mounts/unmounts
const BrowserAppWithLogging = (props: BrowserAppProps) => {
  console.log("BrowserApp mounting");
  React.useEffect(() => {
    return () => console.log("BrowserApp unmounting");
  }, []);
  return <BrowserApp {...props} />;
};

export default withAppTemplate(
  BrowserAppWithLogging,
  "Browser",
  undefined,
  true,
);
