/*
 * @Author: garyxuan
 * @Date: 2025-01-09 19:55:38
 * @Description: 
 */
const getApiBaseUrl = () => {
    // GitHub Pages 环境
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
        // 使用 Vercel 的 API 地址
        return 'https://colorful-todo-list-kappa.vercel.app/api';
    }

    // Vercel 环境或本地开发环境
    return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl(); 