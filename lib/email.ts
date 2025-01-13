import nodemailer from 'nodemailer';

// 创建邮件发送器
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',  // 163 邮箱 SMTP 服务器
    port: 465,
    secure: true,          // 使用 SSL
    auth: {
        user: process.env.EMAIL_USER,     // 发件邮箱
        pass: process.env.EMAIL_PASS      // 163 邮箱的授权码
    }
});

export async function sendVerificationCode(email: string, code: string) {
    try {
        await transporter.sendMail({
            from: `"Colorful Todo List" <${process.env.EMAIL_USER}>`,  // 发件人
            to: email,                     // 收件人
            subject: '验证码 - Colorful Todo List',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6b46c1;">Colorful Todo List</h2>
                    <p>您好！</p>
                    <p>您的验证码是：</p>
                    <div style="
                        background: linear-gradient(to right, #F0E6FA, #E0F2FE);
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0;
                    ">
                        ${code}
                    </div>
                    <p>验证码有效期为 5 分钟。如果不是您本人操作，请忽略此邮件。</p>
                    <p style="color: #666; font-size: 14px; margin-top: 40px;">
                        此邮件由系统自动发送，请勿回复。
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send verification code:', error);
        throw new Error('发送验证码失败');
    }
}