import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start writing chapter content...',
  className,
  disabled,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Trả về empty string nếu chỉ có thẻ rỗng (tránh gửi '<p></p>' lên server)
      const html = editor.isEmpty ? '' : editor.getHTML()
      onChange(html)
    },
  })

  if (!editor) return null

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      {/* Toolbar */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Marks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="mx-1 h-5" />

          {/* Blockquote + HR */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          {/* Word count */}
          <div className="ml-auto text-xs text-muted-foreground px-2">
            {editor.storage.characterCount?.words?.() ??
              countWords(editor.getText())}{' '}
            words
          </div>
        </div>
      )}

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className={cn(
          'prose prose-sm max-w-none px-4 py-3',
          'min-h-[400px] max-h-[70vh] overflow-y-auto',
          'focus-within:outline-none',
          // Placeholder style (injected by TipTap extension)
          '[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:float-left',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.tiptap_p.is-editor-empty:first-child::before]:h-0',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      />
    </div>
  )
}

// ── Toolbar Button ─────────────────────────────────────────────────────────────

const ToolbarButton = ({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
}) => (
  <Button
    type="button"
    variant={active ? 'secondary' : 'ghost'}
    size="icon"
    className="h-7 w-7"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </Button>
)

// ── Word counter helper ────────────────────────────────────────────────────────

const countWords = (text: string): number =>
  text.trim() ? text.trim().split(/\s+/).length : 0
