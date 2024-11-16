//commands.ts
import { useRouter } from "next/router";
import {
  rootFolder,
  findFolderByPath,
  Folder,
} from "@/components/FolderStructureHelper";

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
];

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
  if (!currentFolder) {
    return "Directory not found";
  }

  const sortedItems = [...currentFolder.children]
    .filter((item) => item.name !== "..")
    .sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "folder" ? -1 : 1;
    });

  const items = sortedItems.map((item) => ({
    name: item.name,
    isFolder: item.type === "folder",
  }));

  return items
    .map((item) =>
      item.isFolder
        ? `<span class="font-bold text-blue-400 mr-4">${item.name}</span>`
        : `<span class="text-slate-100 mr-4">${item.name}</span>`,
    )
    .join("");
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
