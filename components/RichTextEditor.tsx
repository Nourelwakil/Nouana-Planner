import React, { useRef, useState, useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ToolbarButton: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  isActive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, isActive, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
    onMouseDown={e => e.preventDefault()} // Prevents the editor from losing focus
  >
    {children}
  </button>
);

const HIGHLIGHT_COLORS = [
  '#FFFFA7', // Yellow
  '#A7F1A7', // Green
  '#A7D7F1', // Blue
  '#F1A7A7', // Red
  '#E3A7F1', // Purple
];
const CONTRASTING_TEXT_COLOR = '#1f2937'; // Dark gray for readability on light backgrounds

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [commandStates, setCommandStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    highlight: false,
  });

  // This effect synchronizes the editor's content with the `value` prop from the parent.
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const updateToolbarStates = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return;
    }
    
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (!editorRef.current.contains(container)) {
        return;
    }

    const checkAncestor = (node: Node | null, condition: (element: HTMLElement) => boolean): boolean => {
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (condition(node as HTMLElement)) return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    
    const isBold = checkAncestor(container, el => ['B', 'STRONG'].includes(el.tagName) || (parseInt(window.getComputedStyle(el).fontWeight, 10) >= 700));
    const isItalic = checkAncestor(container, el => ['I', 'EM'].includes(el.tagName) || window.getComputedStyle(el).fontStyle === 'italic');
    const isUnderline = checkAncestor(container, el => ['U'].includes(el.tagName) || window.getComputedStyle(el).textDecorationLine === 'underline');
    const isList = checkAncestor(container, el => ['UL', 'OL', 'LI'].includes(el.tagName));
    const isHighlighted = checkAncestor(container, el => {
        const bgColor = el.style.backgroundColor;
        return !!(bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)');
    });

    setCommandStates({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      ul: isList,
      highlight: isHighlighted,
    });
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      updateToolbarStates();
      handleInput();
    }
  };

  // Effect to handle clicks outside the color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
    };
    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerOpen]);

  // Effect to update toolbar on selection change or interaction
  useEffect(() => {
    const handleInteraction = () => updateToolbarStates();
    
    document.addEventListener('selectionchange', handleInteraction);
    const editor = editorRef.current;
    editor?.addEventListener('focus', handleInteraction);
    editor?.addEventListener('keyup', handleInteraction);
    editor?.addEventListener('mouseup', handleInteraction);
    editor?.addEventListener('input', handleInteraction);


    return () => {
      document.removeEventListener('selectionchange', handleInteraction);
      editor?.removeEventListener('focus', handleInteraction);
      editor?.removeEventListener('keyup', handleInteraction);
      editor?.removeEventListener('mouseup', handleInteraction);
      editor?.removeEventListener('input', handleInteraction);
    };
  }, [updateToolbarStates]);
  
  const removeHighlight = () => {
    execCommand('backColor', 'transparent');
    // Attempt to reset text color to default.
    const defaultColor = window.getComputedStyle(document.body).getPropertyValue('color');
    execCommand('foreColor', defaultColor);
    setIsColorPickerOpen(false);
  };

  const handleHighlightClick = () => {
    if (commandStates.highlight) {
      removeHighlight();
    } else {
      setIsColorPickerOpen(prev => !prev);
    }
  };
  
  const applyHighlight = (color: string) => {
    execCommand('backColor', color);
    execCommand('foreColor', CONTRASTING_TEXT_COLOR);
    setIsColorPickerOpen(false);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg flex-wrap">
        <ToolbarButton onClick={() => execCommand('bold')} title="Bold" isActive={commandStates.bold}>
          <i className="fa-solid fa-bold"></i>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic" isActive={commandStates.italic}>
          <i className="fa-solid fa-italic"></i>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Underline" isActive={commandStates.underline}>
          <i className="fa-solid fa-underline"></i>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List" isActive={commandStates.ul}>
          <i className="fa-solid fa-list-ul"></i>
        </ToolbarButton>
        
        <div className="relative" ref={colorPickerRef}>
          <ToolbarButton onClick={handleHighlightClick} title="Highlight" isActive={commandStates.highlight}>
            <i className="fa-solid fa-highlighter"></i>
          </ToolbarButton>
          
          <div className={`absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-10 transition-all duration-150 ease-out transform origin-top ${isColorPickerOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {HIGHLIGHT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => applyHighlight(color)}
                    className="w-6 h-6 rounded-md transition-transform hover:scale-110 border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: color }}
                    aria-label={`Highlight ${color}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={removeHighlight}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-md flex items-center space-x-2"
              >
                <i className="fa-solid fa-ban"></i>
                <span>No Color</span>
              </button>
            </div>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={updateToolbarStates} // Update state when editor loses focus too
        className="p-3 min-h-[120px] focus:outline-none text-gray-800 dark:text-gray-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
};