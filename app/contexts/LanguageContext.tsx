/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:15:37
 * @Description: 
 */
'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'zh';

// 定义翻译对象的接口
interface TranslationType {
  [key: string]: string;
}

interface Translations {
  en: TranslationType;
  zh: TranslationType;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  en: {
    'todoList': 'Todo List',
    'addTodo': 'Add',
    'progress': 'Progress',
    'completed': 'completed',
    'customizeColors': 'Customize Colors',
    'startColor': 'Start Color',
    'endColor': 'End Color',
    'addNewTodo': 'Add a new todo',
  },
  zh: {
    'todoList': '待办事项',
    'addTodo': '添加',
    'progress': '进度',
    'completed': '已完成',
    'customizeColors': '自定义颜色',
    'startColor': '起始颜色',
    'endColor': '结束颜色',
    'addNewTodo': '添加新的待办事项',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

