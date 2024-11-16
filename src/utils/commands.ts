//commands.ts
import { useRouter } from "next/router";
import {
  rootFolder,
  findFolderByPath,
  Folder,
} from "@/components/FolderStructureHelper";
import { useFileSystemStore } from "@/stores/fileSystemStore";

type CommandHandler = (
  args: string[],
  router: ReturnType<typeof useRouter>,
) => string | void;

interface CommandHelp {
  command: string;
  description: string;
  usage: string;
}

const commandList: CommandHelp[] = [
  {
    command: "cd",
    description: "Change directory",
    usage: "cd <directory> | cd .. | cd ~",
  },
  {
    command: "ls",
    description: "List directory contents",
    usage: "ls [directory]",
  },
  {
    command: "help",
    description: "Show available commands",
    usage: "help [command]",
  },
  {
    command: "touch",
    description: "Create a new empty file",
    usage: "touch <filename>",
  },
  {
    command: "vim",
    description: "Edit a file using vim-like editor",
    usage: "vim <filename>",
  },
];

export const vim: CommandHandler = (args, router) => {
  if (args.length === 0) {
    return "vim: missing file operand";
  }

  const fileName = args[0];
  const currentPath = router.pathname;
  const fullPath = `${currentPath}/${fileName}`.replace(/\/+/g, "/");

  const fileSystem = useFileSystemStore.getState();
  if (!fileSystem.fileExists(fullPath)) {
    fileSystem.addFile(currentPath, fileName);
  }

  const content = fileSystem.getFileContent(fullPath);

  // Make sure we're not double-encoding or adding extra spaces
  return `<vim-editor path="${fullPath}" content="${content || ""}"></vim-editor>`;
};

export const cd: CommandHandler = (args, router) => {
  const targetDirectory = args[0];
  if (!targetDirectory) {
    router.push("/");
    return;
  }

  if (targetDirectory === "~") {
    router.push("/");
    return;
  }

  if (targetDirectory === "..") {
    const currentPath = router.pathname;
    const parentPath = currentPath.split("/").slice(0, -1).join("/");
    router.push(parentPath || "/");
    return;
  }

  router.push(targetDirectory);
};

export const ls: CommandHandler = (args, router) => {
  const currentFolder = findFolderByPath(router.pathname, rootFolder);
  const fileSystem = useFileSystemStore.getState();
  const currentPath = router.pathname === "/" ? "" : router.pathname;

  if (!currentFolder) {
    return "Directory not found";
  }

  // Get built-in files and folders
  const builtInItems = [...currentFolder.children].filter(
    (item) => item.name !== "..",
  );

  // Get virtual files for current directory
  const virtualFiles = fileSystem.virtualFiles.filter((file) => {
    if (currentPath === "" || currentPath === "/") {
      return file.path === "" || file.path === "/";
    }
    return file.path === currentPath;
  });

  // Combine and format all items
  const allItems = [
    ...builtInItems.map((item) => ({
      name: item.name,
      isFolder: item.type === "folder",
    })),
    ...virtualFiles.map((file) => ({
      name: file.name,
      isFolder: false,
    })),
  ].sort((a, b) => {
    if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
    return a.isFolder ? -1 : 1;
  });

  // Format items with consistent width (10 chars per item)
  const formattedItems = allItems.map((item) => {
    const displayName = item.name.padEnd(10);
    return item.isFolder
      ? `<span class="font-bold text-blue-400">${displayName}</span>`
      : `<span class="text-slate-100">${displayName}</span>`;
  });

  // Arrange items in rows of 3 with consistent spacing
  let output = "";
  for (let i = 0; i < formattedItems.length; i += 3) {
    output += formattedItems.slice(i, i + 3).join("") + "\n";
  }

  return output.trim();
};

export const touch: CommandHandler = (args, router) => {
  if (args.length === 0) {
    return "touch: missing file operand";
  }

  const fileName = args[0];
  const currentPath = router.pathname;

  // Don't allow creating files with paths for now
  if (fileName.includes("/")) {
    return "touch: cannot create file with path";
  }

  const fileSystem = useFileSystemStore.getState();
  const fullPath = `${currentPath}/${fileName}`.replace(/\/+/g, "/");

  if (fileSystem.fileExists(fullPath)) {
    return `touch: file '${fileName}' already exists`;
  }

  fileSystem.addFile(currentPath, fileName);
  return undefined; // touch doesn't produce output on success
};

export const help: CommandHandler = (args, router) => {
  if (args.length === 0) {
    // Format with explicit line breaks
    return [
      "Available commands:",
      "",
      "cd      - Change directory",
      "ls      - List directory contents",
      "help    - Show available commands",
      "",
      'Use "help <command>" for more information about a specific command.',
    ].join("\n");
  }

  const commandName = args[0];
  const command = commandList.find((cmd) => cmd.command === commandName);
  if (!command) {
    return `Command '${commandName}' not found`;
  }

  // Format detailed help with proper spacing
  return [
    `Command: ${command.command}`,
    `Description: ${command.description}`,
    `Usage: ${command.usage}`,
  ].join("\n");
};
