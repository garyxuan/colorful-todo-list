/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:01:07
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
];

// CORS 预检请求处理
export async function OPTIONS() {
    const origin = headers().get('origin') || '';

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

export async function POST(req: Request) {
    try {
        const origin = headers().get('origin') || '';
        const corsHeaders = {
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        await dbConnect();
        const { email, preferences } = await req.json();

        // 查找或创建用户
        let user = await User.findOne({ email });

        if (!user) {
            // 创建新用户，使用邮箱作为密码（简化版本）
            user = await User.create({
                email,
                password: email,
                lastSync: new Date(),
                preferences // 使用传入的偏好设置
            });
        }

        // 生成JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            token,
            user: {
                email: user.email,
                lastSync: user.lastSync,
                preferences: user.preferences || preferences // 如果用户没有偏好设置，使用传入的设置
            }
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: '认证失败' },
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