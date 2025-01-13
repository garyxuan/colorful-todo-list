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
];

// CORS 预检请求处理
export async function OPTIONS() {
    const origin = headers().get('origin') || '';

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
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // 获取并验证 token
        const authHeader = headers().get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: '未授权' },
                { status: 401, headers: corsHeaders }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };

        await dbConnect();

        // 获取用户信息
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: '用户不存在' },
                { status: 404, headers: corsHeaders }
            );
        }

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
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
} 