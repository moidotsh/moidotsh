//_app.tsx
import AppDock from "@/components/AppDock";
import BrowserApp from "@/components/BrowserApp";
import FurthestLayer from "@/components/FurthestLayer";
import MiddleTop from "@/components/MiddleTop";
import MusicApp from "@/components/MusicApp";
import NavApp from "@/components/NavApp";
import TerminalApp from "@/components/TerminalApp";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const onExitComplete = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="overflow-hidden h-screen w-screen">

      <NavApp />
      <TerminalApp />
      <MusicApp />
      <AppDock />
      <BrowserApp />

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
