/** @type {import('next').NextConfig} */
const nextConfig = {
    // 由于同时支持 GitHub Actions 和 Vercel 部署，所以需要根据环境变量来设置输出和 basePath
    // 如果是 GitHub Actions 环境，则输出为静态文件，并设置 basePath
    ...(process.env.GITHUB_ACTIONS ? {
        output: 'export',
        basePath: '/colorful-todo-list',
    } : {}),
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
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
}

export default nextConfig
