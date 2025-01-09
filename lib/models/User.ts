/*
 * @Author: garyxuan
 * @Date: 2025-01-09 17:00:46
 * @Description: 
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// 密码加密中间件
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// 验证密码方法
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema); 