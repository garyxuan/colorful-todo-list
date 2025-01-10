import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// 设置为动态路由
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 检查当前连接状态
        const state = mongoose.connection.readyState;
        const states = {
            0: '未连接',
            1: '已连接',
            2: '正在连接',
            3: '正在断开连接',
            99: '未初始化',
        };

        if (state !== 1) {
            console.log('Attempting to connect to database...');
            await dbConnect();
        }

        // 获取数据库信息
        const dbName = mongoose.connection.name;
        const host = mongoose.connection.host;
        const port = mongoose.connection.port;

        return NextResponse.json({
            status: 'success',
            database: {
                state: states[state as keyof typeof states],
                connection: `${host}:${port}/${dbName}`,
                readyState: state,
            }
        });
    } catch (error) {
        console.error('Database health check failed:', error);
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : '数据库连接检查失败',
        }, { status: 500 });
    }
} 