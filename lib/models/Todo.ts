import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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

// 创建索引以优化查询性能
todoSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema); 