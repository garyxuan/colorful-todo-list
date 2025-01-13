/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:01:07
 * @Description: 
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import VerificationCode from '@/lib/models/VerificationCode';
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: Request) {
    try {
        const origin = headers().get('origin') || '';
        const corsHeaders = {
            'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? origin : (allowedOrigins.includes(origin) ? origin : '*'),
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        await dbConnect();
        const { email, code } = await req.json();

        console.log('Authenticating user:', email);
        console.log('Verification code:', code);

        // 验证验证码
        const verificationCode = await VerificationCode.findOne({
            email,
            code,
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // 5分钟内的验证码
        });

        if (!verificationCode) {
            console.log('Invalid or expired verification code');
            return NextResponse.json(
                { error: '验证码无效或已过期' },
                { status: 400, headers: corsHeaders }
            );
        }

        console.log('Valid verification code found');

        // 验证成功后删除验证码
        await VerificationCode.deleteOne({ _id: verificationCode._id });

        // 查找或创建用户
        let user = await User.findOne({ email });

        if (!user) {
            console.log('Creating new user');
            user = await User.create({
                email,
                lastSync: new Date(),
                password: Math.random().toString(36), // 生成随机密码
                preferences: {
                    startColor: '#F0E6FA',
                    endColor: '#E0F2FE'
                }
            });
        } else {
            console.log('Existing user found');
        }

        // 生成JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Generated token for user');

        return NextResponse.json({
            token,
            user: {
                email: user.email,
                lastSync: user.lastSync,
                preferences: user.preferences
            }
        }, { headers: corsHeaders });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: '认证失败' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? headers().get('origin') || '*' : '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
} 