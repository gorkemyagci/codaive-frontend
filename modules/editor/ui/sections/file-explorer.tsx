"use client"
import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, Plus, MoreVertical, Trash2, Edit2, Check, X } from "lucide-react";

interface FileNode {
  id: string;
  type: "file";
  name: string;
}
interface FolderNode {
  id: string;
  type: "folder";
  name: string;
  children: NodeType[];
}
type NodeType = FileNode | FolderNode;

const initialTree: NodeType[] = [
  {
    id: "1",
    type: "folder",
    name: "src",
    children: [
      { id: "2", type: "file", name: "index.tsx" },
      { id: "3", type: "file", name: "app.tsx" },
      {
        id: "4",
        type: "folder",
        name: "components",
        children: [
          { id: "5", type: "file", name: "Button.tsx" },
        ],
      },
    ],
  },
  { id: "6", type: "file", name: "package.json" },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Dosya uzantısına göre ikon döndür
function getFileIcon(name: string) {
  if (name.endsWith('.tsx')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-cyan-400"><svg width="16" height="16" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="16" rx="2.5" ry="2.5" fill="#06b6d4"/><ellipse cx="16" cy="16" rx="10" ry="4.5" stroke="#06b6d4" strokeWidth="2"/><ellipse cx="16" cy="16" rx="10" ry="4.5" stroke="#06b6d4" strokeWidth="2" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="10" ry="4.5" stroke="#06b6d4" strokeWidth="2" transform="rotate(120 16 16)"/></svg></span>;
  }
  if (name.endsWith('.ts')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-blue-500 font-bold text-[10px]">TS</span>;
  }
  if (name.endsWith('.js')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-yellow-400 font-bold text-[10px]">JS</span>;
  }
  if (name.endsWith('.py')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-yellow-300">🐍</span>;
  }
  if (name.endsWith('.json')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-orange-400 font-bold text-[10px]">{`{}`}</span>;
  }
  if (name.endsWith('.md')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-gray-400 font-bold text-[10px]">MD</span>;
  }
  if (name.endsWith('.css')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-pink-400">🎨</span>;
  }
  if (name.endsWith('.html')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-red-400">🌐</span>;
  }
  if (name.endsWith('.sh')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-green-400"></span>; // terminal/komut satırı ikonu (nerd font veya emoji)
  }
  if (name.endsWith('.env')) {
    return <span className="w-4 h-4 mr-1 flex items-center justify-center text-lime-400">🔑</span>;
  }
  return <FileText className="w-4 h-4 text-blue-400 mr-1" />;
}

const FileExplorer = () => {
  const [tree, setTree] = useState<NodeType[]>(initialTree);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [adding, setAdding] = useState<{ parentId: string | null; type: "file" | "folder" | null }>({ parentId: null, type: null });
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (parentId: string | null, type: "file" | "folder") => {
    setAdding({ parentId, type });
    setNewName("");
  };

  const handleAddConfirm = () => {
    if (!newName.trim() || !adding.type) {
      setAdding({ parentId: null, type: null });
      setNewName("");
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

  const renderNode = (node: NodeType, parentId: string | null = null, depth = 0) => {
    const isFolder = node.type === "folder";
    const isSelected = selectedId === node.id;
    const isRenaming = renamingId === node.id;
    return (
      <div key={node.id} className="group flex flex-col relative">
        <div
          className={`flex items-center h-7 rounded cursor-pointer relative text-[13px] font-medium ${
            isSelected ? "bg-zinc-800 text-white/70" : "hover:bg-[#23272e]"
          }`}
          style={{ paddingLeft: 4 + depth * 16 }}
          onClick={() => handleSelect(node.id)}
          onContextMenu={e => handleContextMenu(e, node.id)}
        >
          {/* Klasör aç/kapa oku */}
          {isFolder ? (
            <span onClick={e => { e.stopPropagation(); toggle(node.id); }} className="mr-1 flex items-center w-4">
              {expanded[node.id] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </span>
          ) : (
            <span className="w-4 mr-1" />
          )}
          {/* Klasör/dosya ikonları */}
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
          {/* Sağ üç nokta menüsü */}
          <button
            className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-muted transition"
            onClick={e => { e.stopPropagation(); setContextMenuId(node.id === contextMenuId ? null : node.id); }}
            title="Daha fazla"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {/* Context menu */}
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
        {/* Altına yeni dosya/klasör ekleme inputu */}
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
        {/* Alt klasörler */}
        {isFolder && expanded[node.id] && node.children && (
          <div>
            {node.children.map((child: any) => renderNode(child, node.id, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Kökte yeni dosya/klasör ekleme
  return (
    <div className="p-2 text-xs select-none h-full">
      <div className="flex items-center mb-2 gap-1">
        <span className="font-semibold text-foreground tracking-wider text-[13px]">EXPLORER</span>
        <button
          className="ml-auto p-1 rounded hover:bg-muted"
          onClick={() => handleAdd(null, "file")}
          title="Kökte dosya ekle"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          className="p-1 rounded hover:bg-muted"
          onClick={() => handleAdd(null, "folder")}
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
      <div className="space-y-1 mt-2">
        {tree.map((node) => renderNode(node, null, 0))}
      </div>
    </div>
  );
};

export default FileExplorer;