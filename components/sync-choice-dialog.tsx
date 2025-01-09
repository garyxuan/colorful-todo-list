'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { CloudUpload, CloudDownload } from 'lucide-react';

interface SyncChoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChoice: (uploadLocal: boolean) => Promise<void>;
    isLoading: boolean;
}

export function SyncChoiceDialog({
    open,
    onOpenChange,
    onChoice,
    isLoading
}: SyncChoiceDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('syncChoice')}</DialogTitle>
                    <DialogDescription>
                        {t('syncChoiceDescription')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                        className="flex flex-col items-center gap-2 h-auto py-4"
                        onClick={() => onChoice(true)}
                        disabled={isLoading}
                    >
                        <CloudUpload className="h-8 w-8" />
                        <span className="text-sm">{t('uploadLocal')}</span>
                        <span className="text-xs text-gray-500">{t('uploadLocalDescription')}</span>
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex flex-col items-center gap-2 h-auto py-4"
                        onClick={() => onChoice(false)}
                        disabled={isLoading}
                    >
                        <CloudDownload className="h-8 w-8" />
                        <span className="text-sm">{t('downloadCloud')}</span>
                        <span className="text-xs text-gray-500">{t('downloadCloudDescription')}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 