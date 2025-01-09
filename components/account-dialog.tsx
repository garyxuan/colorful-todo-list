/*
 * @Author: garyxuan
 * @Date: 2025-01-09 18:28:06
 * @Description: 
 */
'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useSync } from "@/app/contexts/SyncContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
    const { t } = useLanguage();
    const { userEmail, lastSync, logout, autoSync, setAutoSync } = useSync();

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('accountInfo')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">{t('email')}</Label>
                        <div className="text-base font-medium text-gray-900">{userEmail}</div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">{t('lastSync')}</Label>
                        <div className="text-base font-medium text-gray-900">{formatDate(lastSync)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900">{t('autoSync')}</Label>
                            <div className="text-xs text-gray-500">{t('autoSyncDescription')}</div>
                        </div>
                        <Switch
                            checked={autoSync}
                            onCheckedChange={setAutoSync}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            logout();
                            onOpenChange(false);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                        {t('logout')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 