/** @type {import('next').NextConfig} */
const nextConfig = {
    // 应用配置
    images: {
        unoptimized: true,
    },
    // PWA 相关配置
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    // 确保静态资源正确加载
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    // 确保静态文件被正确复制
    distDir: '.next',
    // 静态文件配置
    publicRuntimeConfig: {
        staticFolder: '/public',
    },
}

export default nextConfig
