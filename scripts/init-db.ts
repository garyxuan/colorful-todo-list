/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:53:32
 * @Description: 
 */
import mongoose from 'mongoose';
import dbConnect from '../lib/db';

async function initDatabase() {
    try {
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Connected successfully');

        // 删除现有的集合
        console.log('Dropping existing collections...');
        try {
            await mongoose.connection.dropCollection('users');
            await mongoose.connection.dropCollection('todos');
            console.log('Existing collections dropped successfully');
        } catch (error) {
            console.log('No existing collections to drop');
        }

        // 创建用户集合
        const userSchema = new mongoose.Schema({
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
            lastSync: {
                type: Date,
                default: Date.now,
            },
            preferences: {
                startColor: {
                    type: String,
                    required: true,
                    default: '#F0E6FA'
                },
                endColor: {
                    type: String,
                    required: true,
                    default: '#E0F2FE'
                }
            }
        }, {
            timestamps: true,
        });

        // 创建待办事项集合
        const todoSchema = new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            id: {
                type: String,
                required: true,
                index: true,
                unique: true,
            },
            text: {
                type: String,
                required: true,
            },
            completed: {
                type: Boolean,
                default: false,
            },
            color: {
                type: String,
                default: '#000000',
            },
            order: {
                type: Number,
                default: 0,
            }
        }, {
            timestamps: true,
        });

        // 创建索引
        todoSchema.index({ userId: 1, createdAt: -1 });

        // 注册模型
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

        // 创建测试用户
        const testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            await User.create({
                email: 'test@example.com',
                password: 'test@example.com',
                lastSync: new Date(),
                preferences: {
                    startColor: '#F0E6FA',
                    endColor: '#E0F2FE'
                }
            });
            console.log('Created test user');
        }

        console.log('Database initialization completed');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDatabase();