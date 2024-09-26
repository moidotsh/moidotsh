// index.tsx

import PageTransition from "@/components/PageTransition";
import { forwardRef } from "react";
import FurthestLayer from "@/components/FurthestLayer";
import MiddleTop from "@/components/MiddleTop";
import MiddleBot from "@/components/MiddleBot";
import Bot from "@/components/Bot";

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

function IndexPage(props: IndexPageProps, ref: IndexPageRef) {




  return (
    <PageTransition ref={ref}>
      <div className="page1 overflow-hidden">
        <FurthestLayer />
        <MiddleTop />
        <MiddleBot />
        <Bot />
      </div>
      <Analytics />

    </PageTransition>
  );
}

export default forwardRef(IndexPage);
