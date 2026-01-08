import React, { useEffect, useMemo, useRef } from 'react';

/**
 * Simple toolbar-driven rich text editor built on top of contentEditable.
 * Provides basic formatting controls without pulling in external dependencies.
 */
export default function RichTextEditor({
    value = '',
    onChange,
    label,
    error,
    placeholder = 'Start writing your post...',
}) {
    const editorRef = useRef(null);
    const normalizedValue = value ?? '';

    useEffect(() => {
        if (! editorRef.current) {
            return;
        }

        if (editorRef.current.innerHTML !== normalizedValue) {
            editorRef.current.innerHTML = normalizedValue || '';
        }
    }, [normalizedValue]);

    const handleInput = () => {
        if (! editorRef.current) {
            return;
        }

        const html = editorRef.current.innerHTML.replace(/<br\s*\/?>$/i, '').trim();
        onChange?.(html);
    };

    const exec = (command, valueArg = null) => {
        if (! editorRef.current) {
            return;
        }

        editorRef.current.focus();
        document.execCommand(command, false, valueArg);
        handleInput();
    };

    const addLink = () => {
        const url = window.prompt('URL');
        if (! url) {
            return;
        }

        exec('createLink', url.startsWith('http') ? url : `https://${url}`);
    };

    const controls = useMemo(
        () => [
            { label: 'B', action: () => exec('bold') },
            { label: 'I', action: () => exec('italic') },
            { label: 'U', action: () => exec('underline') },
            { label: 'H2', action: () => exec('formatBlock', 'h2') },
            { label: 'Quote', action: () => exec('formatBlock', 'blockquote') },
            { label: 'UL', action: () => exec('insertUnorderedList') },
            { label: 'OL', action: () => exec('insertOrderedList') },
            { label: 'Link', action: () => addLink() },
            { label: 'Code', action: () => exec('formatBlock', 'pre') },
            { label: 'Clear', action: () => exec('removeFormat') },
        ],
        []
    );

    const isEmpty = ! normalizedValue || normalizedValue === '<p><br></p>';

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-slate-200">{label}</label>}

            <div className="rounded-xl border border-slate-700 bg-slate-900">
                <div className="flex flex-wrap gap-2 border-b border-slate-800 p-2">
                    {controls.map((control) => (
                        <button
                            key={control.label}
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                control.action();
                            }}
                            className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-700"
                        >
                            {control.label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div
                        ref={editorRef}
                        className="min-h-[280px] w-full rounded-b-xl px-4 py-3 text-sm text-white focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onBlur={handleInput}
                    />
                    {isEmpty && (
                        <span className="pointer-events-none absolute left-4 top-3 text-sm text-slate-500">
                            {placeholder}
                        </span>
                    )}
                </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
