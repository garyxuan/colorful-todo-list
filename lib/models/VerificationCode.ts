import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5分钟后自动删除
    }
});

const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode; 