/*
 * @Author: garyxuan
 * @Date: 2025-01-09 19:55:38
 * @Description: 
 */
import { useState, useEffect } from 'react';

// 默认 API URL
const defaultApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// 获取 API 基础 URL
const getApiBaseUrl = () => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') {
        return defaultApiUrl;
    }

    // GitHub Pages 环境
    if (window.location.hostname.includes('github.io')) {
        return 'https://colorful-todo-list-kappa.vercel.app/api';
    }

    // 本地开发环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '/api';
    }

    // Vercel 环境
    return defaultApiUrl;
};

// 导出 hook 用于获取 API URL
export const useApiBaseUrl = () => {
    const [apiBaseUrl, setApiBaseUrl] = useState(defaultApiUrl);

    useEffect(() => {
        setApiBaseUrl(getApiBaseUrl());
    }, []);

    return apiBaseUrl;
};

// 为了向后兼容，仍然导出静态值
export const API_BASE_URL = getApiBaseUrl(); 