/*
 * @Author: garyxuan
 * @Date: 2025-01-09 19:55:38
 * @Description: 
 */
const getApiBaseUrl = () => {
    // 使用环境变量中的配置，如果没有则默认使用相对路径
    return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl(); 