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
    const { isLoggedIn, isLoading, syncTodos, login } = useSync();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showAccountDialog, setShowAccountDialog] = useState(false);
    const [showSyncChoiceDialog, setShowSyncChoiceDialog] = useState(false);

    const handleLogin = async (email: string) => {
        try {
            await login(email);
            // 登录成功后，显示同步选择对话框
            setShowLoginDialog(false);
            setShowSyncChoiceDialog(true);
        } catch (error) {
            // 如果是新用户，错误会被 LoginDialog 处理
            // 如果是其他错误，也会被 LoginDialog 处理
            throw error;
        }
    };

    const handleSyncChoice = async (uploadLocal: boolean) => {
        try {
            if (uploadLocal) {
                // 上传本地数据到云端
                await syncTodos(todos);
            } else {
                // 从云端下载数据
                const response = await fetch('/api/todos', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch cloud data');
                }
                const data = await response.json();
                // 更新本地todos
                onUpdateTodos(data.todos);
            }
            setShowSyncChoiceDialog(false);
        } catch (error) {
            console.error('Sync error:', error);
            // 可以添加错误提示
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
                onLogin={handleLogin}
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