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

// 允许的源
const allowedOrigins = [
    'https://garyxuan.github.io',
    'http://localhost:3000',
    'http://localhost:4000',
    'https://colorful-todo-list-git-main-garyxuans-projects.vercel.app',
    'https://colorful-todo-list-kappa.vercel.app'
];

// CORS 预检请求处理
export async function OPTIONS() {
    const origin = headers().get('origin') || '';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // 在开发环境中允许所有源
    if (isDevelopment) {
        return new NextResponse(null, {
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    // 检查是否是允许的源
    if (allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

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
        const origin = headersList.get('origin') || '';
        const isDevelopment = process.env.NODE_ENV === 'development';

        const corsHeaders = {
            'Access-Control-Allow-Origin': isDevelopment ? (origin || '*') : (allowedOrigins.includes(origin) ? origin : '*'),
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (!token) {
            console.log('No token provided');
            return NextResponse.json({ error: '未授权' }, { status: 401, headers: corsHeaders });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            console.log('Invalid token');
            return NextResponse.json({ error: '无效的token' }, { status: 401, headers: corsHeaders });
        }

        await dbConnect();
        console.log('Database connected, fetching todos for user:', decoded.userId);
        const todos = await Todo.find({ userId: decoded.userId }).sort({ createdAt: -1 });
        console.log('Fetched todos:', todos.length);

        return NextResponse.json({ todos }, { headers: corsHeaders });
    } catch (error) {
        console.error('Get todos error:', error);
        return NextResponse.json(
            { error: '获取待办事项失败' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
}

// 同步待办事项
export async function POST(req: Request) {
    try {
        const headersList = headers();
        const token = headersList.get('authorization')?.split(' ')[1];
        const origin = headersList.get('origin') || '';
        const isDevelopment = process.env.NODE_ENV === 'development';

        const corsHeaders = {
            'Access-Control-Allow-Origin': isDevelopment ? (origin || '*') : (allowedOrigins.includes(origin) ? origin : '*'),
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (!token) {
            console.log('No token provided');
            return NextResponse.json({ error: '未授权' }, { status: 401, headers: corsHeaders });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            console.log('Invalid token');
            return NextResponse.json({ error: '无效的token' }, { status: 401, headers: corsHeaders });
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

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        console.error('Sync todos error:', error);
        return NextResponse.json(
            { error: '同步失败' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
} 