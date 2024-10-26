import "@/styles/globals.css";
import "@/utils/appletRegistration";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import AppDock from "@/components/AppDock";
import AppletContainer from "@/components/AppletContainer";

export default function App({ Component, pageProps }: AppProps) {
  const onExitComplete = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="overflow-hidden h-screen w-screen">
      <AppletContainer />
      <AppDock />
      <AnimatePresence
        onExitComplete={onExitComplete}
        initial={false}
        mode="popLayout"
      >
        <Component {...pageProps} />
      </AnimatePresence>
    </div>
  );
}
