//NavApp.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { rootFolder, findFolderByPath } from "./FolderStructureHelper";
import { Folder, File } from "react-feather";
import withAppTemplate from "./withAppTemplate";
import { useVisibilityStore } from "@/stores/visibilityStore";
import { getContent } from "@/utils/contentMapping";

type Props = {
  setDynamicTitle?: (title: string) => void;
};

const NavApp: React.FC<Props> = ({ setDynamicTitle }) => {
  const router = useRouter();

  // Get all the browser-related functions we need
  const { openBrowser, setBrowserLoading, browserVisible } = useVisibilityStore(
    (state) => ({
      openBrowser: state.openBrowser,
      setBrowserLoading: state.setBrowserLoading,
      browserVisible: state.browserVisible,
    }),
  );

  const currentFolder = useMemo(
    () => findFolderByPath(router.pathname, rootFolder),
    [router.pathname],
  );

  const handleFileClick = (fileName: string) => {
    console.log("Click handler - starting");
    console.log("Current store state:", useVisibilityStore.getState());

    // Get content
    const content = getContent(fileName);
    const title = `Browser | ${fileName}`;

    // Show loading state
    setBrowserLoading(true);

    // Update browser immediately instead of setTimeout
    console.log("Opening browser with:", { content, title });
    openBrowser(content, title);
    setBrowserLoading(false);

    console.log("Click handler - finished");
    console.log("Final store state:", useVisibilityStore.getState());
  };

  useEffect(() => {
    const newTitle = `/home/arman${router.pathname}`;
    setDynamicTitle?.(newTitle);
  }, [router.pathname, setDynamicTitle]);

  const sortedChildren = currentFolder
    ? [...currentFolder.children].sort((a, b) => {
        if (a.type === "folder" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "folder") return 1;
        return 0;
      })
    : [];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mt-4 w-full">
        <ul className="grid grid-cols-4 mt-4 justify-between">
          {sortedChildren.map((child, index) => (
            <li className={`col-start-${index + 1} relative`} key={child.name}>
              {child.type === "folder" ? (
                <Link href={child.path || "#"}>
                  <div className="flex flex-col items-center gap-2 cursor-pointer z-[2000]">
                    <Folder />
                    <p className="text-xs">{child.name}</p>
                  </div>
                </Link>
              ) : (
                <div
                  className="flex flex-col items-center gap-2 z-[2000] cursor-pointer"
                  onClick={() => {
                    const fullPath =
                      router.pathname === "/"
                        ? `/${child.name}`
                        : `${router.pathname}/${child.name}`;
                    handleFileClick(fullPath);
                  }}
                >
                  <File />
                  <p className="text-xs cursor-pointer select-none z-[2000]">
                    {child.name}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default withAppTemplate(NavApp, "Explorer");
