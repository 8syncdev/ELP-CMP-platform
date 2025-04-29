"use server"
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const EMAIL_STYLES = {
    container: "background-color: hsl(0, 0%, 98%); padding: 20px; border-radius: 8px; color: hsl(240, 5.3%, 26.1%); font-family: Arial, sans-serif;",
    title: "color: hsl(24.6, 95%, 53.1%); margin-bottom: 20px;",
    message: "margin-bottom: 15px;",
    content: "background-color: hsl(240, 4.8%, 95.9%); padding: 15px; border-radius: 6px; margin-top: 20px;",
    footer: "border-top: 1px solid hsl(220, 13%, 91%); margin-top: 20px; padding-top: 20px;",
    signature: "color: hsl(24.6, 95%, 53.1%);"
};

const EMAIL_TEMPLATE = (content: string) => `
    <div style="${EMAIL_STYLES.container}">
        <h2 style="${EMAIL_STYLES.title}">Cảm ơn bạn đã liên hệ với chúng tôi</h2>
        <p style="${EMAIL_STYLES.message}">Chúng tôi sẽ phản hồi sớm nhất có thể trong 48 giờ 🥰</p>
        <div style="${EMAIL_STYLES.content}">
            ${content}
        </div>
        <div style="${EMAIL_STYLES.footer}">
            <p style="${EMAIL_STYLES.signature}">Đội ngũ hỗ trợ</p>
        </div>
    </div>
`;

const connectAndSendEmail = async (email: string, content: string) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
        },
    });

    const mailOptions: Mail.Options = {
        from: process.env.MY_EMAIL,
        to: [process.env.MY_EMAIL as string, email],
        subject: `Liên hệ mới`,
        html: EMAIL_TEMPLATE(content),
    };

    const sendMailPromise = () =>
        new Promise<string>((resolve, reject) => {
            transport.sendMail(mailOptions, function (err) {
                if (!err) {
                    resolve('Email sent');
                } else {
                    reject(err.message);
                }
            });
        });

    try {
        await sendMailPromise();
        return 'email_sent_successfully';
    } catch (err) {
        console.error('Error sending email:', err);
        return 'send_email_fail';
    }
}

export const sendEmail = async (email: string, content: string): Promise<boolean> => {
    try {
        const result = await connectAndSendEmail(email, content);
        if (result === 'email_sent_successfully') {
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error in sendEmail:', err);
        return false;
    }
}