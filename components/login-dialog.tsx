/*
 * @Author: garyxuan
 * @Date: 2025-01-09 18:28:43
 * @Description: 
 */
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useSync } from "@/app/contexts/SyncContext";
import { Loader2 } from 'lucide-react';

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (email: string) => Promise<void>;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
    const { t } = useLanguage();
    const { isLoading } = useSync();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !email.includes('@')) {
            setError(t('invalidEmail'));
            return;
        }

        setError('');
        try {
            await onLogin(email);
        } catch (error) {
            console.error('Login error:', error);
            setError(t('loginFailed'));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('cloudSync')}</DialogTitle>
                    <DialogDescription>
                        {t('enterEmailToLogin')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('enterEmail')}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 