import type { HTMLAttributes } from "react";

export type IconProps = HTMLAttributes<SVGElement>;
export type NodeType = FileNode | FolderNode;

export interface FileNode {
  id: string;
  type: "file";
  name: string;
}

export interface FolderNode {
  id: string;
  type: "folder";
  name: string;
  children: NodeType[];
}
