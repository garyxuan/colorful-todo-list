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

// 设置为动态路由
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

        if (!token) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: '无效的token' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: '用户不存在' }, { status: 404 });
        }

        return NextResponse.json({
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        return NextResponse.json(
            { error: '获取偏好设置失败' },
            { status: 500 }
        );
    }
}

// 更新用户偏好设置
export async function PUT(req: Request) {
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

        const { preferences } = await req.json();

        await dbConnect();
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { preferences },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: '用户不存在' }, { status: 404 });
        }

        return NextResponse.json({
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        return NextResponse.json(
            { error: '更新偏好设置失败' },
            { status: 500 }
        );
    }
} 