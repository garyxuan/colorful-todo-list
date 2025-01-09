/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:14:14
 * @Description: 
 */
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { SyncProvider } from './contexts/SyncContext'

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'A simple todo list app with cloud sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  )
}
