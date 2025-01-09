/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // 启用静态导出
    basePath: '/todo-list', // 设置基础路径为你的仓库名
    images: {
        unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
    },
}

export default nextConfig
