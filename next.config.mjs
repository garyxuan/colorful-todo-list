/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    basePath: process.env.NODE_ENV === 'production' ? '/colorful-todo-list' : '',
    images: {
        unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/colorful-todo-list/' : '',
    trailingSlash: process.env.NODE_ENV === 'production',
}

export default nextConfig
