"use client";

import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TOOLBAR_BUTTONS = [
  { label: "B", cmd: "bold", title: "Bold" },
  { label: "I", cmd: "italic", title: "Italic" },
  { label: "U", cmd: "underline", title: "Underline" },
  { label: "S", cmd: "strikeThrough", title: "Strikethrough" },
];

const BLOCK_OPTIONS = [
  { label: "P", value: "p" },
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
];

const LIST_OPTIONS = [
  { cmd: "insertOrderedList", label: "1." },
  { cmd: "insertUnorderededList", label: "•" },
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const execCmd = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  }, []);

  const handleBlockChange = (tag: string) => {
    execCmd("formatBlock", tag);
  };

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      onChange(e.currentTarget.innerHTML);
    },
    [onChange]
  );

  return (
    <div className="border rounded-md border-input bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-border/50 bg-muted/30">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            onClick={() => execCmd(btn.cmd)}
            className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold hover:bg-muted transition-colors"
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}

        <div className="w-px h-5 bg-border/50 mx-1" />

        <select
          onChange={(e) => handleBlockChange(e.target.value)}
          className="h-7 px-1 rounded text-xs border-0 bg-transparent focus:ring-0 cursor-pointer"
          defaultValue="p"
        >
          {BLOCK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-border/50 mx-1" />

        {LIST_OPTIONS.map((opt) => (
          <button
            key={opt.cmd}
            type="button"
            onClick={() => execCmd(opt.cmd)}
            className="w-7 h-7 flex items-center justify-center rounded text-xs hover:bg-muted transition-colors"
          >
            {opt.label}
          </button>
        ))}

        <div className="w-px h-5 bg-border/50 mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt("Masukkan URL:");
            if (url) execCmd("createLink", url);
          }}
          className="w-7 h-7 flex items-center justify-center rounded text-xs hover:bg-muted transition-colors"
          title="Insert Link"
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[200px] max-h-[400px] overflow-y-auto px-3 py-2 text-sm focus:outline-none prose dark:prose-invert max-w-none prose-sm"
        data-placeholder={placeholder || "Tuliskan konten di sini..."}
        suppressContentEditableWarning
      />
    </div>
  );
}
