/*
 * @Author: garyxuan
 * @Date: 2025-01-09 11:15:32
 * @Description: 
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 获取资源的完整 URL
 * 在 GitHub Pages 环境下添加正确的前缀
 */
export function getAssetPath(path: string): string {
  // 检查是否在 GitHub Pages 环境
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

  // 如果是 GitHub Pages 环境，添加基础路径
  if (isGitHubPages) {
    return `/colorful-todo-list${path}`;
  }

  // 其他环境直接返回路径
  return path;
}
