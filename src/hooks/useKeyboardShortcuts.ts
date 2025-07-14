import { useEffect, useCallback, useState } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const shortcut = shortcuts.find(s => {
      return (
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.metaKey === event.metaKey &&
        !!s.shiftKey === event.shiftKey &&
        !!s.altKey === event.altKey
      );
    });

    if (shortcut) {
      // Don't prevent default if user is typing in an input
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLInputElement ||
                      activeElement instanceof HTMLTextAreaElement ||
                      activeElement instanceof HTMLSelectElement ||
                      (activeElement && activeElement.getAttribute('contenteditable') === 'true');

      // Allow certain shortcuts even when typing
      const allowWhenTyping = ['Escape', 'Enter'];
      
      if (!isTyping || allowWhenTyping.includes(shortcut.key)) {
        event.preventDefault();
        shortcut.action();
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Global keyboard shortcuts hook
export function useGlobalShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      },
      description: 'Focus search'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals or dropdowns
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }
        
        // Trigger escape events for modals
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(escapeEvent);
      },
      description: 'Close modals/dropdowns'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // TODO: Open command palette
        console.log('Command palette shortcut triggered');
      },
      description: 'Open command palette'
    },
    {
      key: 'k',
      metaKey: true, // For Mac
      action: () => {
        // TODO: Open command palette
        console.log('Command palette shortcut triggered');
      },
      description: 'Open command palette'
    }
  ];

  useKeyboardShortcuts(shortcuts);
}

// Konami code easter egg
export function useKonamiCode(callback: () => void) {
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  
  let sequence: string[] = [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      sequence.push(event.code);
      
      // Keep only the last 10 keys
      if (sequence.length > konamiCode.length) {
        sequence = sequence.slice(-konamiCode.length);
      }
      
      // Check if sequence matches
      if (sequence.length === konamiCode.length &&
          sequence.every((key, index) => key === konamiCode[index])) {
        callback();
        sequence = []; // Reset sequence
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}

// Command palette hook (placeholder for future implementation)
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  
  const commands = [
    { id: 'search', label: 'Search prompts...', action: () => console.log('Search') },
    { id: 'new-prompt', label: 'Create new prompt', action: () => console.log('New prompt') },
    { id: 'library', label: 'Go to library', action: () => console.log('Library') },
    { id: 'profile', label: 'View profile', action: () => console.log('Profile') },
  ];

  return {
    isOpen,
    setIsOpen,
    commands
  };
}
