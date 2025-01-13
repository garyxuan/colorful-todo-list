/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:56:43
 * @Description: 
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
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

// 获取用户偏好设置
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
        console.log('Database connected, fetching preferences for user:', decoded.userId);
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('User not found:', decoded.userId);
            return NextResponse.json({ error: '用户不存在' }, { status: 404, headers: corsHeaders });
        }

        console.log('Fetched preferences:', user.preferences);
        return NextResponse.json({
            preferences: user.preferences
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('Get preferences error:', error);
        return NextResponse.json(
            { error: '获取偏好设置失败' },
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

// 更新用户偏好设置
export async function PUT(req: Request) {
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

        const { preferences } = await req.json();
        console.log('Updating preferences for user:', decoded.userId, preferences);

        await dbConnect();
        console.log('Database connected');
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { preferences },
            { new: true }
        );

        if (!user) {
            console.log('User not found:', decoded.userId);
            return NextResponse.json({ error: '用户不存在' }, { status: 404, headers: corsHeaders });
        }

        console.log('Updated preferences:', user.preferences);
        return NextResponse.json({
            preferences: user.preferences
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('Update preferences error:', error);
        return NextResponse.json(
            { error: '更新偏好设置失败' },
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