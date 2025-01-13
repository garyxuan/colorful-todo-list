'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { API_BASE_URL } from '@/lib/api-config';

interface Preferences {
    startColor: string;
    endColor: string;
}

const defaultPreferences: Preferences = {
    startColor: '#F0E6FA',
    endColor: '#E0F2FE'
};

const SyncContext = createContext<{
    isLoggedIn: boolean;
    userEmail: string | null;
    lastSync: Date | null;
    isLoading: boolean;
    autoSync: boolean;
    preferences: Preferences;
    login: (email: string) => Promise<void>;
    logout: () => void;
    syncTodos: (todos: Todo[]) => Promise<Todo[]>;
    updatePreferences: (preferences: Preferences) => Promise<void>;
    setAutoSync: (autoSync: boolean) => void;
    handleLoginSuccess: (token: string) => void;
}>({
    isLoggedIn: false,
    userEmail: null,
    lastSync: null,
    isLoading: false,
    autoSync: true,
    preferences: defaultPreferences,
    login: async () => { },
    logout: () => { },
    syncTodos: async () => [],
    updatePreferences: async () => { },
    setAutoSync: () => { },
    handleLoginSuccess: () => { },
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [autoSync, setAutoSync] = useState(true);
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

    // 从localStorage恢复状态
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('userEmail');
        const savedLastSync = localStorage.getItem('lastSync');
        const savedAutoSync = localStorage.getItem('autoSync');
        const savedPreferences = localStorage.getItem('preferences');

        if (savedToken && savedEmail) {
            setToken(savedToken);
            setUserEmail(savedEmail);
            setIsLoggedIn(true);
            if (savedLastSync) {
                setLastSync(new Date(savedLastSync));
            }
            if (savedPreferences) {
                setPreferences(JSON.parse(savedPreferences));
            }
        }

        if (savedAutoSync !== null) {
            setAutoSync(savedAutoSync === 'true');
        }
    }, []);

    const clearLoginState = useCallback(() => {
        setToken(null);
        setUserEmail(null);
        setLastSync(null);
        setIsLoggedIn(false);
        setPreferences(defaultPreferences);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('lastSync');
        localStorage.removeItem('preferences');
    }, []);

    const handleLoginSuccess = useCallback(async (token: string) => {
        try {
            // 保存 token 到本地存储
            localStorage.setItem('token', token);
            setToken(token);

            // 获取用户信息
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('获取用户信息失败');
            }

            const data = await response.json();

            // 更新状态
            setUserEmail(data.email);
            setLastSync(new Date(data.lastSync));
            setPreferences(data.preferences || defaultPreferences);
            setIsLoggedIn(true);

            // 保存到 localStorage
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('lastSync', data.lastSync);
            localStorage.setItem('preferences', JSON.stringify(data.preferences || defaultPreferences));
        } catch (error) {
            console.error('Login error:', error);
            // 如果获取用户信息失败，清除登录状态
            clearLoginState();
            throw error;
        }
    }, [clearLoginState]);

    const logout = useCallback(() => {
        clearLoginState();
    }, [clearLoginState]);

    const login = useCallback(async (email: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    preferences: preferences // 传递当前的颜色设置
                }),
            });

            if (!response.ok) {
                throw new Error('登录失败');
            }

            const data = await response.json();
            setToken(data.token);
            setUserEmail(data.user.email);
            setLastSync(new Date(data.user.lastSync));
            // 如果服务器返回的 preferences 是 undefined，则使用当前的 preferences
            const newPreferences = data.user.preferences || preferences;
            setPreferences(newPreferences);
            setIsLoggedIn(true);

            // 保存到localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('lastSync', data.user.lastSync);
            localStorage.setItem('preferences', JSON.stringify(newPreferences));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [preferences]);

    const updatePreferences = useCallback(async (newPreferences: Preferences) => {
        if (!token || !isLoggedIn) {
            // 即使未登录也更新本地状态
            setPreferences(newPreferences);
            localStorage.setItem('preferences', JSON.stringify(newPreferences));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ preferences: newPreferences }),
            });

            if (!response.ok) {
                throw new Error('更新偏好设置失败');
            }

            const data = await response.json();
            // 如果服务器返回的 preferences 是 undefined，使用新的设置
            const updatedPreferences = data.preferences || newPreferences;
            setPreferences(updatedPreferences);
            localStorage.setItem('preferences', JSON.stringify(updatedPreferences));
        } catch (error) {
            console.error('Update preferences error:', error);
            // 发生错误时，仍然更新本地状态，保持用户体验
            setPreferences(newPreferences);
            localStorage.setItem('preferences', JSON.stringify(newPreferences));
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [token, isLoggedIn]);

    const syncTodos = useCallback(async (todos: Todo[]) => {
        if (!token || !isLoggedIn) return todos;

        setIsLoading(true);
        try {
            if (todos.length === 0) {
                // 如果传入空数组，则从服务器获取数据
                console.log('Fetching todos from server...');
                const response = await fetch(`${API_BASE_URL}/todos`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取云端数据失败');
                }

                const data = await response.json();
                console.log('Received data from server:', data);

                if (!data.todos || !Array.isArray(data.todos)) {
                    console.error('Invalid data format from server:', data);
                    throw new Error('服务器返回的数据格式无效');
                }

                // 确保每个todo都有必要的字段
                const validTodos = data.todos.map((todo: any) => ({
                    id: todo.id,
                    text: todo.text || '',
                    completed: Boolean(todo.completed),
                    color: todo.color || '#F0E6FA',
                    order: Number(todo.order) || 0
                }));

                console.log('Processed todos:', validTodos);
                setLastSync(new Date());
                localStorage.setItem('lastSync', new Date().toISOString());
                return validTodos;
            } else {
                // 上传本地数据到云端
                console.log('Uploading todos to server:', todos);
                const response = await fetch(`${API_BASE_URL}/todos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ todos }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.details || '同步失败');
                }

                setLastSync(new Date());
                localStorage.setItem('lastSync', new Date().toISOString());
                return todos;
            }
        } catch (error) {
            console.error('Sync error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [token, isLoggedIn, API_BASE_URL]);

    return (
        <SyncContext.Provider
            value={{
                isLoggedIn,
                userEmail,
                lastSync,
                isLoading,
                preferences,
                login,
                logout,
                syncTodos,
                updatePreferences,
                autoSync,
                setAutoSync: (value: boolean) => {
                    setAutoSync(value);
                    localStorage.setItem('autoSync', String(value));
                },
                handleLoginSuccess,
            }}
        >
            {children}
        </SyncContext.Provider>
    );
}

export const useSync = () => useContext(SyncContext); 