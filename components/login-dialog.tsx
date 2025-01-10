/*
 * @Author: garyxuan
 * @Date: 2025-01-09 18:28:43
 * @Description: 
 */
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/lib/api-config';

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginSuccess: (token: string) => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            setError('请输入有效的邮箱地址');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '发送验证码失败');
            }

            setCodeSent(true);
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : '发送验证码失败');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !email.includes('@')) {
            setError('请输入有效的邮箱地址');
            return;
        }

        if (!code) {
            setError('请输入验证码');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '登录失败');
            }

            onLoginSuccess(data.token);
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>登录</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="请输入邮箱"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="请输入验证码"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={loading || !codeSent}
                        />
                        <Button
                            onClick={handleSendCode}
                            disabled={loading || countdown > 0}
                        >
                            {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                        </Button>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}
                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={loading || !codeSent}
                    >
                        {loading ? '登录中...' : '登录'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 