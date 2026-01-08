import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, List, ListOrdered, Quote, Code,
    Heading1, Heading2, Heading3, Image as ImageIcon,
    Link as LinkIcon, Youtube as YoutubeIcon
} from 'lucide-react';
import { api } from '../../services/api';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
    const extensions = React.useMemo(() => [
        StarterKit,
        Image.configure({
            HTMLAttributes: {
                class: 'max-w-full h-auto rounded-lg',
            },
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-ruju-red underline font-medium',
            },
        }),
        Youtube.configure({
            width: 640,
            height: 360,
        }),
        Placeholder.configure({
            placeholder: placeholder || 'Start writing...',
        }),
    ], [placeholder]);

    const editor = useEditor({
        extensions,
        content,
        onUpdate: ({ editor }) => {
            if (!editor || editor.isDestroyed) return;
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-6 max-w-none',
            },
        },
    });

    // Use a ref to track the latest content from the parent to avoid unnecessary setContent calls
    const contentRef = React.useRef(content);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    // Update editor content when prop changes, but ONLY if it's external change
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        const currentHtml = editor.getHTML();
        if (content !== currentHtml && !editor.isFocused) {
            // Only set content if it's actually different and editor is NOT focused
            // to avoid cursor jumps and overwriting user input.
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    const handleImageUpload = useCallback(async () => {
        if (!editor || editor.isDestroyed || !editor.view) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            try {
                const data = await api.uploadImage(file);
                const imageUrl = data.url || data.path || data.imageUrl;

                if (imageUrl && editor && !editor.isDestroyed) {
                    // Use relative path since we have a proxy
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                } else if (!imageUrl) {
                    throw new Error('No image URL returned from server');
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                if (!editor?.isDestroyed) {
                    alert(error instanceof Error ? error.message : 'Failed to upload image');
                }
            }
        };

        input.click();
    }, [editor]);

    const handleAddLink = useCallback(() => {
        if (!editor || editor.isDestroyed || !editor.view) return;

        const url = prompt('Enter URL:');
        if (!url) return;

        const linkType = prompt('Link type (source/evidence/reference):');

        editor.chain().focus().setLink({
            href: url,
            class: linkType ? `link-${linkType}` : undefined
        }).run();
    }, [editor]);

    const handleAddYoutube = useCallback(() => {
        if (!editor || editor.isDestroyed || !editor.view) return;

        const url = prompt('Enter YouTube URL:');
        if (!url) return;

        editor.commands.setYoutubeVideo({ src: url });
    }, [editor]);

    // Safe command execution helper
    const exec = useCallback((command: (e: any) => any) => {
        if (editor && !editor.isDestroyed && editor.view) {
            command(editor.chain().focus()).run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col min-h-[500px] bg-white shadow-sm ring-1 ring-black/5 hover:ring-black/10 transition-shadow">
            {/* Toolbar - Sticky with shadow when active */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 sticky top-0 z-30 shadow-sm backdrop-blur-sm bg-gray-50/95">
                <button
                    onClick={() => exec(e => e.toggleHeading({ level: 1 }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => exec(e => e.toggleHeading({ level: 2 }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    onClick={() => exec(e => e.toggleHeading({ level: 3 }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </button>

                <div className="w-px bg-gray-300 mx-1 self-stretch" />

                <button
                    onClick={() => exec(e => e.toggleBold())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => exec(e => e.toggleItalic())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Italic"
                >
                    <Italic size={18} />
                </button>

                <div className="w-px bg-gray-300 mx-1 self-stretch" />

                <button
                    onClick={() => exec(e => e.toggleBulletList())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => exec(e => e.toggleOrderedList())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>

                <div className="w-px bg-gray-300 mx-1 self-stretch" />

                <button
                    onClick={() => exec(e => e.toggleBlockquote())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Blockquote"
                >
                    <Quote size={18} />
                </button>
                <button
                    onClick={() => exec(e => e.toggleCodeBlock())}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-300 shadow-inner' : ''}`}
                    title="Code Block"
                >
                    <Code size={18} />
                </button>

                <div className="w-px bg-gray-300 mx-1 self-stretch" />

                <button
                    onClick={handleImageUpload}
                    className="p-2 rounded hover:bg-gray-200 transition-colors text-blue-600"
                    title="Upload Image"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    onClick={handleAddLink}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-300 shadow-inner' : 'text-blue-600'}`}
                    title="Add Link"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    onClick={handleAddYoutube}
                    className="p-2 rounded hover:bg-gray-200 transition-colors text-red-600"
                    title="Embed YouTube"
                >
                    <YoutubeIcon size={18} />
                </button>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 bg-white p-2">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
