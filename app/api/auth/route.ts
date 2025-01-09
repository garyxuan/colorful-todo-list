import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
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
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: '认证失败' },
            { status: 500 }
        );
    }
} 