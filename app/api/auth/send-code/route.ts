import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import VerificationCode from '@/lib/models/VerificationCode';

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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(req: Request) {
    try {
        const origin = headers().get('origin') || '';
        const corsHeaders = {
            'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: '无效的邮箱地址' },
                { status: 400, headers: corsHeaders }
            );
        }

        await dbConnect();

        // 生成6位随机验证码
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 保存验证码到数据库
        await VerificationCode.create({
            email,
            code
        });

        // TODO: 这里需要集成邮件发送服务
        // 目前仅在控制台打印验证码，方便测试
        console.log(`验证码 ${code} 已发送到邮箱 ${email}`);

        return NextResponse.json(
            { message: '验证码已发送' },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error('Send code error:', error);
        return NextResponse.json(
            { error: '发送验证码失败' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    }
} 