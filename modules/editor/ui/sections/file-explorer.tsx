"use client"
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, Plus, MoreVertical, Trash2, Edit2, Check, X } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { NodeType } from "@/lib/types";
import { Icons } from "@/components/icons";

function getFileIcon(name: string) {
  let iconName: keyof typeof Icons = name as keyof typeof Icons;
  const icon = iconName.split(".")[1];
  const IconComponent = Icons[icon as keyof typeof Icons];
  const whiteIcons = ['json'];
  return <IconComponent className={cn("w-4 h-4 mr-1", {
    "text-white fill-white": whiteIcons.includes(icon)
  })} />
}

interface FileExplorerProps {
  tree: NodeType[];
  setTree: React.Dispatch<React.SetStateAction<NodeType[]>>;
  selectedFile: NodeType | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<NodeType | null>>;
}

const FileExplorer = ({ tree, setTree, selectedFile, setSelectedFile }: FileExplorerProps) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [adding, setAdding] = useState<{ parentId: string | null; type: "file" | "folder" | null }>({ parentId: null, type: null });
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [emptyMenu, setEmptyMenu] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const explorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(tree);
  }, [tree]);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (parentId: string | null, type: "file" | "folder") => {
    setAdding({ parentId, type });
    setNewName("");
    setEmptyMenu({ x: 0, y: 0, show: false });
  };

  const handleAddConfirm = () => {
    if (!newName.trim() || !adding.type) {
      setAdding({ parentId: null, type: null });
      setNewName("");
      return;
    }

    const nameExists = (nodes: NodeType[], parentId: string | null): boolean => {
      if (parentId === null) {
        return nodes.some(node => node.name === newName);
      }

      const findInNodes = (nodesArr: NodeType[]): boolean => {
        for (const node of nodesArr) {
          if (node.id === parentId && node.type === "folder") {
            return node.children ? node.children.some(child => child.name === newName) : false;
          }
          if (node.type === "folder" && node.children) {
            const found = findInNodes(node.children);
            if (found) return true;
          }
        }
        return false;
      };
      
      return findInNodes(nodes);
    };

    if (nameExists(tree, adding.parentId)) {
      alert(`A file or folder with the name "${newName}" already exists in this location.`);
      return;
    }

    const addToTree = (nodes: NodeType[]): NodeType[] => {
      return nodes.map((node) => {
        if (node.id === adding.parentId && node.type === "folder") {
          const children = node.children ? [...node.children] : [];
          const newNode: NodeType = adding.type === "file"
            ? { id: generateId(), type: "file", name: newName }
            : { id: generateId(), type: "folder", name: newName, children: [] };
          return { ...node, children: [...children, newNode] };
        } else if (node.type === "folder" && node.children) {
          return { ...node, children: addToTree(node.children) };
        }
        return node;
      });
    };
    if (adding.parentId) {
      setTree((prev) => addToTree([...prev]));
    } else {
      const newNode: NodeType = adding.type === "file"
        ? { id: generateId(), type: "file", name: newName }
        : { id: generateId(), type: "folder", name: newName, children: [] };
      setTree((prev) => [
        ...prev,
        newNode,
      ]);
    }
    setAdding({ parentId: null, type: null });
    setNewName("");
  };

  const handleAddCancel = () => {
    setAdding({ parentId: null, type: null });
    setNewName("");
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    
    const findNode = (nodes: NodeType[]): NodeType | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.type === "folder" && node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const node = findNode(tree);
    
    if (node && node.type === "file") {
      setSelectedFile(node);
    } else {
    }
  };

  const handleRename = (id: string, name: string) => {
    setRenamingId(id);
    setRenameValue(name);
    setContextMenuId(null);
  };

  const handleRenameConfirm = () => {
    if (!renamingId || !renameValue.trim()) return;
    const renameInTree = (nodes: NodeType[]): NodeType[] =>
      nodes.map((node) => {
        if (node.id === renamingId) {
          return { ...node, name: renameValue };
        } else if (node.type === "folder" && node.children) {
          return { ...node, children: renameInTree(node.children) };
        }
        return node;
      });
    setTree((prev) => renameInTree([...prev]));
    setRenamingId(null);
    setRenameValue("");
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDelete = (id: string) => {
    const deleteFromTree = (nodes: NodeType[]): NodeType[] =>
      nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.type === "folder" && node.children) {
          node.children = deleteFromTree(node.children);
        }
        return true;
      });
    setTree((prev) => deleteFromTree([...prev]));
    if (selectedId === id) setSelectedId(null);
    setContextMenuId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenuId(id);
  };

  const handleCloseContextMenu = () => setContextMenuId(null);

  const handleEmptyContextMenu = (e: React.MouseEvent) => {
    if (e.target === explorerRef.current) {
      e.preventDefault();
      setEmptyMenu({ x: e.clientX, y: e.clientY, show: true });
    }
  };
  const closeEmptyMenu = () => setEmptyMenu({ x: 0, y: 0, show: false });

  const renderNode = (node: NodeType, parentId: string | null = null, depth = 0) => {
    const isFolder = node.type === "folder";
    const isSelected = selectedId === node.id;
    const isRenaming = renamingId === node.id;
    return (
      <div key={node.id} className="group flex flex-col relative">
        <div
          className={cn(
            "flex items-center h-7 rounded cursor-pointer relative text-[13px] font-medium transition-colors",
            isSelected ? "bg-zinc-800 text-white/80 shadow-sm" : "hover:bg-zinc-700/40"
          )}
          style={{ paddingLeft: depth ? 8 + depth * 16 : 8 }}
          onClick={() => handleSelect(node.id)}
          onContextMenu={e => handleContextMenu(e, node.id)}
        >
          {isFolder ? (
            <span onClick={e => { e.stopPropagation(); toggle(node.id); }} className="mr-1 flex items-center w-4">
              {expanded[node.id] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </span>
          ) : (
            <></>
          )}
          {isFolder ? (
            expanded[node.id] ? <FolderOpen className="w-4 h-4 text-yellow-400 mr-1" /> : <Folder className="w-4 h-4 text-yellow-400 mr-1" />
          ) : (
            getFileIcon(node.name)
          )}
          {isRenaming ? (
            <input
              autoFocus
              className="flex-1 bg-transparent border-b border-accent outline-none text-sm px-1"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onBlur={handleRenameConfirm}
              onKeyDown={e => {
                if (e.key === "Enter") handleRenameConfirm();
                if (e.key === "Escape") handleRenameCancel();
              }}
            />
          ) : (
            <span className="flex-1 truncate select-none" onDoubleClick={() => isFolder && toggle(node.id)}>{node.name}</span>
          )}
          <button
            className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-muted transition"
            onClick={e => { e.stopPropagation(); setContextMenuId(node.id === contextMenuId ? null : node.id); }}
            title="Daha fazla"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {contextMenuId === node.id && (
            <div className="absolute z-10 right-0 top-7 min-w-[120px] bg-[#23272e] border border-[#333] rounded shadow-lg py-1 text-xs" onMouseLeave={handleCloseContextMenu}>
              <button className="flex items-center w-full px-3 py-1 hover:bg-[#2c3e50]" onClick={() => handleRename(node.id, node.name)}>
                <Edit2 className="w-3 h-3 mr-2" /> Yeniden adlandır
              </button>
              <button className="flex items-center w-full px-3 py-1 hover:bg-[#2c3e50] text-red-400" onClick={() => handleDelete(node.id)}>
                <Trash2 className="w-3 h-3 mr-2" /> Sil
              </button>
              {isFolder && <>
                <button className="flex items-center w-full px-3 py-1 hover:bg-[#2c3e50]" onClick={() => handleAdd(node.id, "file")}> <Plus className="w-3 h-3 mr-2" /> Yeni dosya</button>
                <button className="flex items-center w-full px-3 py-1 hover:bg-[#2c3e50]" onClick={() => handleAdd(node.id, "folder")}> <Folder className="w-3 h-3 mr-2" /> Yeni klasör</button>
              </>}
            </div>
          )}
        </div>
        {adding.parentId === node.id && (
          <div className="flex items-center px-2 py-2 gap-1">
            {adding.type === "file" ? (
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-400 shrink-0" />
            )}
            <input
              autoFocus
              className="flex-1 bg-transparent border-b pb-1 border-accent outline-none text-sm px-1"
              placeholder=""
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleAddConfirm();
                if (e.key === "Escape") handleAddCancel();
              }}
              onBlur={handleAddConfirm}
            />
          </div>
        )}
        {isFolder && expanded[node.id] && node.children && (
          <div>
            {node.children.map((child: any) => renderNode(child, node.id, depth + 1))}
          </div>
        )}
      </div>
    );
  };


  return (
    <div
      ref={explorerRef}
      className="p-2 text-xs select-none h-full bg-zinc-900/90 border border-zinc-800 shadow-lg relative overflow-auto"
      onContextMenu={handleEmptyContextMenu}
      onClick={closeEmptyMenu}
    >
      <div className="flex items-center mb-2 gap-1">
        <span className="font-semibold text-foreground tracking-wider text-[13px]">EXPLORER</span>
        <button
          className="ml-auto p-1 rounded hover:bg-muted"
          onClick={e => { e.stopPropagation(); handleAdd(null, "file"); }}
          title="Kökte dosya ekle"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-muted"
          onClick={e => { e.stopPropagation(); handleAdd(null, "folder"); }}
          title="Kökte klasör ekle"
        >
          <Folder className="w-4 h-4" />
        </button>
      </div>
      {adding.parentId === null && adding.type && (
        <div className="flex items-center px-2 pl-3 py-1 gap-1">
          {adding.type === "file" ? (
            <FileText className="w-4 h-4 shrink-0 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-400 shrink-0" />
          )}
          <input
            autoFocus
            className="flex-1 bg-transparent border-b border-accent outline-none text-sm px-1"
            placeholder=""
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAddConfirm();
              if (e.key === "Escape") handleAddCancel();
            }}
            onBlur={handleAddConfirm}
          />
        </div>
      )}
      <div className="space-y-1 mt-2 min-h-[40px]">
        {tree.length === 0 && (
          <div className="text-zinc-500 text-xs flex items-center justify-center h-10 italic">No files or folders</div>
        )}
        {tree.map((node) => renderNode(node, null, 0))}
      </div>
      {emptyMenu.show && (
        <div
          className="fixed z-50 min-w-[140px] bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 text-xs"
          style={{ left: emptyMenu.x, top: emptyMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <button className="flex items-center w-full px-3 py-1 hover:bg-zinc-800" onClick={() => handleAdd(null, "file")}> <Plus className="w-3 h-3 mr-2" /> Yeni dosya</button>
          <button className="flex items-center w-full px-3 py-1 hover:bg-zinc-800" onClick={() => handleAdd(null, "folder")}> <Folder className="w-3 h-3 mr-2" /> Yeni klasör</button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;