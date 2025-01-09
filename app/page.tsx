'use client'

import { TodoList } from '../components/todo-list'
import { LanguageProvider } from '../app/contexts/LanguageContext'

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100 py-6">
        <TodoList />
      </main>
    </LanguageProvider>
  )
}

