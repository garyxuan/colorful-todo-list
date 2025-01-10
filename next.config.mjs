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
}

export default nextConfig
