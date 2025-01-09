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
    'cloudSync': 'Cloud Sync',
    'enterEmailToLogin': 'Enter your email to login or register',
    'email': 'Email',
    'enterEmail': 'Enter your email',
    'invalidEmail': 'Please enter a valid email',
    'loginFailed': 'Login failed, please try again',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'accountInfo': 'Account Info',
    'lastSync': 'Last Sync',
    'autoSync': 'Auto Sync',
    'autoSyncDescription': 'Sync automatically every 5 seconds',
    'logout': 'Logout',
    'syncChoice': 'Choose Sync Direction',
    'syncChoiceDescription': 'This account already exists. Choose how to sync your data:',
    'uploadLocal': 'Upload Local',
    'uploadLocalDescription': 'Upload local data to cloud',
    'downloadCloud': 'Download Cloud',
    'downloadCloudDescription': 'Download cloud data to local'
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
    'cloudSync': '云同步',
    'enterEmailToLogin': '请输入邮箱地址进行登录或注册',
    'email': '邮箱地址',
    'enterEmail': '请输入邮箱地址',
    'invalidEmail': '请输入有效的邮箱地址',
    'loginFailed': '登录失败，请重试',
    'cancel': '取消',
    'confirm': '确定',
    'accountInfo': '账号信息',
    'lastSync': '上次同步时间',
    'autoSync': '自动同步',
    'autoSyncDescription': '每5秒自动同步一次',
    'logout': '退出登录',
    'syncChoice': '选择同步方式',
    'syncChoiceDescription': '该账号已存在，请选择如何同步数据：',
    'uploadLocal': '上传本地',
    'uploadLocalDescription': '将本地数据上传到云端',
    'downloadCloud': '下载云端',
    'downloadCloudDescription': '将云端数据下载到本地'
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

