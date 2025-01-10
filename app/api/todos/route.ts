/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:01:22
 * @Description: 
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Todo from '@/lib/models/Todo';
import jwt from 'jsonwebtoken';

// GitHub Pages 环境下不需要动态路由配置
// export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证JWT token
async function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

// 获取用户的所有待办事项
export async function GET() {
    try {
        const headersList = headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: '无效的token' }, { status: 401 });
        }

        await dbConnect();
        const todos = await Todo.find({ userId: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ todos });
    } catch (error) {
        console.error('Get todos error:', error);
        return NextResponse.json(
            { error: '获取待办事项失败' },
            { status: 500 }
        );
    }
}

// 同步待办事项
export async function POST(req: Request) {
    try {
        const headersList = headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: '无效的token' }, { status: 401 });
        }

        const { todos } = await req.json();
        console.log('Received todos:', todos);

        await dbConnect();
        console.log('Database connected');

        // 更新用户的最后同步时间
        const updatedUser = await User.findByIdAndUpdate(decoded.userId, {
            lastSync: new Date()
        });
        console.log('User updated:', updatedUser);

        // 删除用户的所有待办事项
        const deleteResult = await Todo.deleteMany({ userId: decoded.userId });
        console.log('Deleted todos:', deleteResult);

        // 创建新的待办事项
        if (Array.isArray(todos) && todos.length > 0) {
            const todosWithUserId = todos.map(todo => ({
                userId: decoded.userId,
                id: todo.id,
                text: todo.text,
                completed: todo.completed,
                color: todo.color,
                order: todo.order
            }));
            console.log('Prepared todos:', todosWithUserId);

            const insertedTodos = await Todo.insertMany(todosWithUserId);
            console.log('Inserted todos:', insertedTodos);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sync todos error details:', error instanceof Error ? error.message : error);
        if (error instanceof Error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return NextResponse.json(
            { error: '同步失败', details: error instanceof Error ? error.message : '未知错误' },
            { status: 500 }
        );
    }
} 