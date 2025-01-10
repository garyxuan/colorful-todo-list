'use client';

import { SyncProvider } from "@/app/contexts/SyncContext";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SyncProvider>
            {children}
        </SyncProvider>
    );
} 