/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:17:41
 * @Description: 
 */
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Cloud } from 'lucide-react';
import { useSync } from '@/app/contexts/SyncContext';
import { LoginDialog } from '@/components/login-dialog';
import { AccountDialog } from '@/components/account-dialog';
import { SyncChoiceDialog } from '@/components/sync-choice-dialog';
import { Todo } from '@/types/todo';

interface SyncButtonProps {
    todos: Todo[];
    onUpdateTodos: (todos: Todo[]) => void;
}

export function SyncButton({ todos, onUpdateTodos }: SyncButtonProps) {
    const { isLoggedIn, isLoading, syncTodos, handleLoginSuccess } = useSync();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showAccountDialog, setShowAccountDialog] = useState(false);
    const [showSyncChoiceDialog, setShowSyncChoiceDialog] = useState(false);

    const handleLoginComplete = async (token: string) => {
        handleLoginSuccess(token);
        setShowLoginDialog(false);
        setShowSyncChoiceDialog(true);
    };

    const handleSyncChoice = async (uploadLocal: boolean) => {
        try {
            if (uploadLocal) {
                // 上传本地数据到云端
                await syncTodos(todos);
            } else {
                // 从云端下载数据
                const cloudTodos = await syncTodos([]);  // 发送空数组来获取云端数据
                onUpdateTodos(cloudTodos);
            }
            setShowSyncChoiceDialog(false);
        } catch (error) {
            console.error('Sync error:', error);
        }
    };

    const handleClick = async () => {
        if (!isLoggedIn) {
            setShowLoginDialog(true);
        } else {
            // 如果已登录，显示账号信息
            setShowAccountDialog(true);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleClick}
                disabled={isLoading}
                className={`text-purple-600 hover:text-purple-700 hover:bg-purple-100 ${isLoading ? 'animate-pulse' : ''}`}
            >
                <Cloud className={`h-6 w-6 ${isLoggedIn ? 'text-purple-600' : 'text-gray-400'}`} />
            </Button>

            <LoginDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                onLoginSuccess={handleLoginComplete}
            />

            <AccountDialog
                open={showAccountDialog}
                onOpenChange={setShowAccountDialog}
            />

            <SyncChoiceDialog
                open={showSyncChoiceDialog}
                onOpenChange={setShowSyncChoiceDialog}
                onChoice={handleSyncChoice}
                isLoading={isLoading}
            />
        </>
    );
} 