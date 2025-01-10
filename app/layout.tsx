/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:14:14
 * @Description: 
 */
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Colorful Todo List',
  description: 'A beautiful and colorful todo list application',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
