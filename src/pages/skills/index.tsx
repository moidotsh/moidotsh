// skills/index.tsx

import PageTransition from "@/components/PageTransition";
import { forwardRef } from "react";
import MiddleBot from "@/components/MiddleBot";
import Bot from "@/components/Bot";
import FurthestLayer from "@/components/FurthestLayer";
import MiddleTop from "@/components/MiddleTop";

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

function IndexPage(props: IndexPageProps, ref: IndexPageRef) {

  return (
    <PageTransition ref={ref}>
      <div className="page2 h-screen overflow-x-hidden overflow-y-hidden">
        <FurthestLayer />
        <MiddleTop />
        <MiddleBot />
        <Bot />
      </div>
    </PageTransition >
  );
}

export default forwardRef(IndexPage);
