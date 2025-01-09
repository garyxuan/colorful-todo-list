const getApiBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_BASE_URL || '';
    }
    return '';  // 开发环境使用相对路径
};

export const API_BASE_URL = getApiBaseUrl(); 