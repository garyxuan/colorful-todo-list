/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:14:14
 * @Description: 
 */
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SyncProvider } from './contexts/SyncContext'

// 预加载 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 使用字体交换以提高性能
  preload: true,
})

// 根据环境确定图标路径前缀
const iconPrefix = process.env.GITHUB_ACTIONS ? '.' : '';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Colorful Todo List',
  description: 'A beautiful and colorful todo list application',
  icons: {
    icon: [
      { url: `${iconPrefix}/favicon.ico`, sizes: 'any' },
      { url: `${iconPrefix}/icons/icon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-72x72.png`, sizes: '72x72', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-96x96.png`, sizes: '96x96', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-128x128.png`, sizes: '128x128', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-144x144.png`, sizes: '144x144', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-152x152.png`, sizes: '152x152', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-192x192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${iconPrefix}/icons/icon-512x512.png`, sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: `${iconPrefix}/favicon.ico` }],
    apple: [
      { url: `${iconPrefix}/icons/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: `${iconPrefix}/icons/apple-touch-icon.png`,
      },
    ],
  },
  manifest: `${iconPrefix}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Colorful Todo List',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* 预加载关键资源 */}
        <link
          rel="preload"
          href="/api/auth/me"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  )
}
