'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Trash2, Settings, Cloud } from 'lucide-react'
import { ColorPicker } from './color-picker'
import { useLanguage } from '../app/contexts/LanguageContext'
import { useSync } from '@/app/contexts/SyncContext'
import { SyncButton } from './sync-button'
import { Todo } from '@/types/todo'

// 定义本地存储的键名
const STORAGE_KEY = 'todos'

// 默认颜色
const DEFAULT_COLORS = {
  startColor: '#F0E6FA',
  endColor: '#E0F2FE'
}

interface StorageData {
  todos: Todo[]
}

export function TodoList() {
  // 使用 useState 的函数形式来避免水合错误
  const [mounted, setMounted] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const { language, setLanguage, t } = useLanguage()
  const { isLoggedIn, autoSync, syncTodos, preferences = DEFAULT_COLORS, updatePreferences } = useSync()
  const { startColor = DEFAULT_COLORS.startColor, endColor = DEFAULT_COLORS.endColor } = preferences || DEFAULT_COLORS

  // 在组件挂载后再加载本地存储的数据
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const data = JSON.parse(storedData) as StorageData
          if (Array.isArray(data.todos)) {
            setTodos(data.todos)
          }
        }
      } catch (error) {
        console.error('Failed to load data from localStorage:', error)
      }
    }

    loadStoredData()
    setMounted(true)
  }, [])

  // 保存数据到本地存储
  useEffect(() => {
    if (!mounted) return

    try {
      const data: StorageData = {
        todos
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [todos, mounted])

  // 自动同步功能
  useEffect(() => {
    let syncTimeout: NodeJS.Timeout

    if (isLoggedIn && autoSync && mounted) {
      // 使用setTimeout实现5秒节流
      syncTimeout = setTimeout(() => {
        syncTodos(todos).catch(console.error)
      }, 5000)
    }

    return () => {
      if (syncTimeout) {
        clearTimeout(syncTimeout)
      }
    }
  }, [todos, isLoggedIn, autoSync, syncTodos, mounted])

  const handleColorChange = async (type: 'start' | 'end', color: string) => {
    try {
      await updatePreferences({
        ...preferences,
        [type === 'start' ? 'startColor' : 'endColor']: color
      });
    } catch (error) {
      console.error('Failed to update color:', error);
    }
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodos = [...todos, {
        id: crypto.randomUUID(),
        text: newTodo,
        completed: false,
        color: '#000000',
        order: todos.length
      }]
      setTodos(newTodos)
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const { completedTodos, progress } = useMemo(() => {
    const completed = todos.length > 0 ? todos.filter(todo => todo.completed).length : 0
    return {
      completedTodos: completed,
      progress: todos.length === 0 ? 0 : (completed / todos.length) * 100
    }
  }, [todos])

  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${startColor}, ${endColor})`
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  const handleUpdateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  // 如果组件还没挂载，返回初始UI状态
  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="p-6 rounded-lg shadow-lg" style={gradientStyle}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{t('todoList')}</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" disabled className="text-purple-600 hover:text-purple-700 hover:bg-purple-100">
                <Cloud className="h-6 w-6 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" disabled className="text-purple-600 hover:text-purple-700 hover:bg-purple-100">
                <Settings className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t('progress')}</span>
              <span className="text-sm font-medium text-gray-700">
                0 / 0 {t('completed')}
              </span>
            </div>
            <Progress value={0} className="w-full h-2 bg-white bg-opacity-50 [&>div]:bg-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="p-6 rounded-lg shadow-lg" style={gradientStyle}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('todoList')}</h1>
          <div className="flex items-center gap-2">
            <SyncButton todos={todos} onUpdateTodos={handleUpdateTodos} />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              {language === 'zh' ? (
                <span className="text-lg font-bold">EN</span>
              ) : (
                <span className="text-lg font-bold">中</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-white bg-opacity-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">{t('customizeColors')}</h2>
            <div className="space-y-2">
              <ColorPicker
                label={t('startColor')}
                color={startColor}
                onChange={(color) => handleColorChange('start', color)}
              />
              <ColorPicker
                label={t('endColor')}
                color={endColor}
                onChange={(color) => handleColorChange('end', color)}
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{t('progress')}</span>
            <span className="text-sm font-medium text-gray-700">
              {completedTodos} / {todos.length} {t('completed')}
            </span>
          </div>
          <Progress
            value={progress}
            className="w-full h-2 bg-white bg-opacity-50 [&>div]:bg-purple-600"
          />
        </div>

        <div className="flex mb-4">
          <Input
            type="text"
            placeholder={t('addNewTodo')}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-grow mr-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button onClick={addTodo} className="bg-purple-600 hover:bg-purple-700 text-white">
            {t('addTodo')}
          </Button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-white bg-opacity-75 p-3 rounded-md shadow transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mr-2 border-purple-400 text-purple-600 focus:ring-purple-500"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

