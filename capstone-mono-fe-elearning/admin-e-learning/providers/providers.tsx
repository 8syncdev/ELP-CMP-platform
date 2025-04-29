'use client';

import React from 'react';
import { AuthProvider } from './auth-context';
import { SecurityProvider } from './security-provider';
import { RealtimeProvider } from './realtime-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({
    children,
    themeProps = { attribute: "class", defaultTheme: "system", enableSystem: true }
}: {
    children: React.ReactNode;
    themeProps?: {
        attribute: string;
        defaultTheme: string;
        enableSystem: boolean;
    }
}) {
    return (
        <ThemeProvider
            attribute={themeProps.attribute}
            defaultTheme={themeProps.defaultTheme}
            enableSystem={themeProps.enableSystem}
        >
            <AuthProvider>
                <SecurityProvider onSecurity="true">
                    <RealtimeProvider>
                        {children}
                    </RealtimeProvider>
                </SecurityProvider>
            </AuthProvider>
        </ThemeProvider>
    );
} 