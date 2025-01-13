import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

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

    // 如果是开发环境，允许所有源
    if (process.env.NODE_ENV === 'development') {
        return new NextResponse(null, {
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    // 生产环境检查允许的源
    if (allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function GET() {
    try {
        const origin = headers().get('origin') || '';
        const corsHeaders = {
            'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? origin : (allowedOrigins.includes(origin) ? origin : '*'),
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // 获取并验证 token
        const authHeader = headers().get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Missing or invalid authorization header');
            return NextResponse.json(
                { error: '未授权' },
                { status: 401, headers: corsHeaders }
            );
        }

        const token = authHeader.split(' ')[1];
        console.log('Verifying token:', token);
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
        console.log('Decoded token:', decoded);

        await dbConnect();

        // 获取用户信息
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('User not found:', decoded.userId);
            return NextResponse.json(
                { error: '用户不存在' },
                { status: 404, headers: corsHeaders }
            );
        }

        console.log('User found:', user);
        return NextResponse.json({
            email: user.email,
            lastSync: user.lastSync,
            preferences: user.preferences
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('Get user info error:', error);
        return NextResponse.json(
            { error: '获取用户信息失败' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? headers().get('origin') || '*' : '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
} 