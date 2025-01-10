/** @type {import('next').NextConfig} */
const nextConfig = {
    // 根据环境配置不同的选项
    ...(process.env.GITHUB_ACTIONS ? {
        // GitHub Pages 环境：静态导出
        output: 'export',
        basePath: '/colorful-todo-list',
        images: {
            unoptimized: true,
        },
        assetPrefix: '/colorful-todo-list',
    } : {
        // Vercel 环境：完整功能
        images: {
            unoptimized: true,
        },
        async headers() {
            return [
                {
                    source: '/icons/:path*',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'public, max-age=31536000, immutable',
                        },
                    ],
                },
                {
                    source: '/favicon.ico',
                    headers: [
                        {
                            key: 'Cache-Control',
                            value: 'public, max-age=31536000, immutable',
                        },
                    ],
                },
            ];
        },
    }),
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
}

export default nextConfig
