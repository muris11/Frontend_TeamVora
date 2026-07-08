"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Link as LinkIcon, Underline as UnderlineIcon,
  Highlighter, PaintBucket, Quote, Minus
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/shared/media-picker";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Tulis sesuatu di sini..." }: RichTextEditorProps) {
  const { user } = useAuthStore();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [linkColor, setLinkColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl border shadow-sm max-w-full' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
      Placeholder.configure({ placeholder }),
      Underline,
      Highlight.configure({ HTMLAttributes: { class: 'bg-yellow-200 rounded px-1' } }),
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[300px] w-full rounded-b-md border-x border-b border-input bg-background px-4 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setShowMediaPicker(false);
  }

  return (
    <div className="flex flex-col w-full rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-md border bg-muted/30 sticky top-0 z-10">
        
        {/* Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} aria-label="Toggle underline">
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Toggle strike">
            <Strikethrough className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}>
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </Toggle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Styling & Links */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Toggle size="sm" pressed={editor.isActive('highlight')} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
            <Highlighter className="h-4 w-4" />
          </Toggle>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <PaintBucket className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Warna Teks</p>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={linkColor} 
                    onChange={(e) => setLinkColor(e.target.value)} 
                    className="w-12 h-8 p-1 cursor-pointer"
                  />
                  <Button size="sm" onClick={() => editor.chain().focus().setColor(linkColor).run()}>Set</Button>
                  <Button size="sm" variant="outline" onClick={() => editor.chain().focus().unsetColor().run()}>Reset</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowMediaPicker(true)}>
            <ImageIcon className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Gambar</span>
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none w-full" />

      <MediaPicker 
        open={showMediaPicker} 
        onOpenChange={setShowMediaPicker} 
        onSelect={(media) => insertImage(media.url)}
        role={user?.role || "lead"}
      />
    </div>
  );
}
