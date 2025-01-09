/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:14:14
 * @Description: 
 */
import './globals.css'
import { GeistSans } from 'geist/font/sans'

const basePath = process.env.NODE_ENV === 'production' ? '/colorful-todo-list' : ''

export const metadata = {
  title: 'Colorful Todo List',
  description: 'A beautiful and colorful todo list application',
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/icons/icon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}/icons/icon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: `${basePath}/icons/icon-192x192.png` },
    ],
    shortcut: [`${basePath}/favicon.ico`],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Colorful Todo',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#E0F2FE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="icon" href={`${basePath}/favicon.ico`} sizes="any" />
        <link rel="icon" href={`${basePath}/icons/icon-16x16.png`} type="image/png" sizes="16x16" />
        <link rel="icon" href={`${basePath}/icons/icon-32x32.png`} type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon-192x192.png`} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Colorful Todo" />
        <meta name="theme-color" content="#E0F2FE" />
      </head>
      <body>{children}</body>
    </html>
  )
}
