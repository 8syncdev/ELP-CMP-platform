'use client'
import React, { useEffect, ReactNode } from 'react'

const buildPreventKey = (): void => {
    // Prevent right click
    document.addEventListener('contextmenu', (event: Event) => event.preventDefault());
    
    // Prevent copy
    document.addEventListener('copy', (event: Event) => event.preventDefault());
    document.addEventListener('cut', (event: Event) => event.preventDefault());
    
    // Prevent select text
    document.addEventListener('selectstart', (event: Event) => event.preventDefault());
    
    // Prevent drag
    document.addEventListener('dragstart', (event: Event) => event.preventDefault());
    
    // Prevent screenshot (not 100% effective but adds a layer of protection)
    document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('');
        }
    });
    
    // Prevent screenshot using keyboard shortcuts
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (
            (e.ctrlKey && e.shiftKey && e.key === 'P') || 
            (e.metaKey && e.shiftKey && e.key === 'P')
        ) {
            e.preventDefault();
        }
    });

    document.onkeydown = (e: KeyboardEvent): boolean => {
        const keyCode = e.keyCode || e.which;

        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U keys
        if (
            keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (keyCode === 73 || keyCode === 74)) ||
            (e.ctrlKey && keyCode === 85)
        ) {
            return false;
        }
        return true;
    }
}

interface SecurityProviderProps {
    children: ReactNode;
    onSecurity?: 'true' | 'false';
}

const SecurityProvider: React.FC<SecurityProviderProps> = ({
    children,
    onSecurity = 'true'
}) => {
    useEffect(() => {
        if (onSecurity === 'true') {
            buildPreventKey();
        }
    }, [onSecurity]);

    return <>{children}</>;
}

export default SecurityProvider
