"use server"
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MY_INFO } from '@/constants/my-info';

const EMAIL_STYLES = {
    container: "background-color: #f8f9fa; padding: 30px; border-radius: 12px; color: #333; font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto;",
    header: "text-align: center; margin-bottom: 30px;",
    logo: "margin-bottom: 15px; width: 120px;",
    title: "color: #ff6b00; font-size: 24px; margin-bottom: 15px; font-weight: bold;",
    subtitle: "color: #555; font-size: 16px; margin-bottom: 25px;",
    message: "margin-bottom: 25px; line-height: 1.6; color: #444;",
    content: "background-color: #fff; padding: 25px; border-radius: 8px; margin-top: 20px; border: 1px solid #e9ecef;",
    footer: "border-top: 1px solid #e9ecef; margin-top: 30px; padding-top: 20px; font-size: 14px; color: #777;",
    signature: "color: #ff6b00; font-weight: bold;",
    planInfo: "background-color: #fff9f5; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff6b00;",
    highlight: "color: #ff6b00; font-weight: bold;",
    imageContainer: "margin-top: 20px; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; background-color: white;",
    infoTable: "width: 100%; border-collapse: collapse; margin: 15px 0;",
    infoTableHeader: "text-align: left; padding: 10px; border-bottom: 1px solid #e9ecef; color: #555; font-weight: normal; width: 140px;",
    infoTableCell: "padding: 10px; border-bottom: 1px solid #e9ecef;",
    tag: "display: inline-block; background-color: #fff0e6; padding: 4px 10px; border-radius: 50px; font-size: 12px; color: #ff6b00; margin-right: 5px; font-weight: 600;",
    button: "display: inline-block; background-color: #ff6b00; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px;",
    divider: "border-top: 1px solid #e9ecef; margin: 25px 0;",
    sectionTitle: "font-size: 18px; color: #333; margin-bottom: 15px; font-weight: bold;"
};

const EMAIL_TEMPLATE = (content: string) => `
    <div style="${EMAIL_STYLES.container}">
        <div style="${EMAIL_STYLES.header}">
            <h2 style="${EMAIL_STYLES.title}">Cảm ơn bạn đã liên hệ với chúng tôi</h2>
            <p style="${EMAIL_STYLES.subtitle}">Chúng tôi sẽ phản hồi sớm nhất có thể trong 48 giờ 🥰</p>
        </div>
        <div style="${EMAIL_STYLES.content}">
            ${content}
        </div>
        <div style="${EMAIL_STYLES.footer}">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
            <p style="${EMAIL_STYLES.signature}">Đội ngũ ${MY_INFO.company}</p>
        </div>
    </div>
`;

// Pricing Email Template - Template đẹp cho thông báo đăng ký khóa học
const PRICING_EMAIL_TEMPLATE = (
    name: string,
    email: string,
    phone: string,
    planName: string,
    planPrice: string,
    paymentMethod: string,
    referenceCode: string,
    additionalInfo: string = '',
    imageUrls: string[] = [],
    isAdmin: boolean = false
) => `
    <div style="${EMAIL_STYLES.container}">
        <div style="${EMAIL_STYLES.header}">
            ${isAdmin ? `
                <h2 style="${EMAIL_STYLES.title}">Có đăng ký gói học tập mới!</h2>
                <p style="${EMAIL_STYLES.subtitle}">Người dùng đã đăng ký và gửi thông tin thanh toán</p>
            ` : `
                <h2 style="${EMAIL_STYLES.title}">Cảm ơn bạn đã đăng ký!</h2>
                <p style="${EMAIL_STYLES.subtitle}">Thông tin đăng ký của bạn đã được ghi nhận</p>
            `}
        </div>
        
        <div style="${EMAIL_STYLES.content}">
            ${isAdmin ? `
                <h3 style="${EMAIL_STYLES.sectionTitle}">Thông tin người đăng ký</h3>
                <table style="${EMAIL_STYLES.infoTable}">
                    <tr>
                        <th style="${EMAIL_STYLES.infoTableHeader}">Họ tên:</th>
                        <td style="${EMAIL_STYLES.infoTableCell}"><strong>${name}</strong></td>
                    </tr>
                    <tr>
                        <th style="${EMAIL_STYLES.infoTableHeader}">Email:</th>
                        <td style="${EMAIL_STYLES.infoTableCell}">${email}</td>
                    </tr>
                    <tr>
                        <th style="${EMAIL_STYLES.infoTableHeader}">Số điện thoại:</th>
                        <td style="${EMAIL_STYLES.infoTableCell}">${phone}</td>
                    </tr>
                </table>
            ` : `
                <p style="${EMAIL_STYLES.message}">
                    Chào <strong>${name}</strong>,<br><br>
                    Cảm ơn bạn đã đăng ký gói học tập tại ${MY_INFO.company}. Chúng tôi đã nhận được thông tin 
                    thanh toán của bạn và sẽ xử lý trong thời gian sớm nhất.
                </p>
            `}
            
            <div style="${EMAIL_STYLES.planInfo}">
                <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 18px;">Thông tin gói học tập</h3>
                <p><span style="${EMAIL_STYLES.highlight}">Gói:</span> ${planName}</p>
                <p><span style="${EMAIL_STYLES.highlight}">Giá:</span> ${planPrice}</p>
                <p><span style="${EMAIL_STYLES.highlight}">Phương thức thanh toán:</span> ${paymentMethod}</p>
                <p><span style="${EMAIL_STYLES.highlight}">Mã tham chiếu:</span> ${referenceCode}</p>
            </div>
            
            ${additionalInfo ? `
                <div style="margin-top: 20px;">
                    <h3 style="${EMAIL_STYLES.sectionTitle}">Thông tin bổ sung</h3>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; color: #555;">
                        ${additionalInfo.replace(/\n/g, '<br>')}
                    </div>
                </div>
            ` : ''}
            
            ${isAdmin ? `
                <div style="${EMAIL_STYLES.imageContainer}">
                    <h3 style="${EMAIL_STYLES.sectionTitle}">Minh chứng thanh toán</h3>
                    <p>Minh chứng thanh toán được đính kèm trong email này.</p>
                </div>
            ` : ''}
            
            ${!isAdmin ? `
                <div style="margin-top: 25px; text-align: center;">
                    <p>Sau khi xác nhận thanh toán, chúng tôi sẽ kích hoạt gói học tập của bạn và gửi email thông báo.</p>
                    <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://8syncdev.com/'}" style="${EMAIL_STYLES.button}">
                        Truy cập trang học tập
                    </a>
                </div>
            ` : `
                <div style="margin-top: 25px; text-align: center;">
                    <p>Vui lòng kiểm tra thông tin thanh toán và xác nhận đăng ký cho người dùng.</p>
                </div>
            `}
        </div>
        
        <div style="${EMAIL_STYLES.footer}">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
            <p>Email: ${MY_INFO.email} | Hotline: ${MY_INFO.contact}</p>
            <p style="${EMAIL_STYLES.signature}">${MY_INFO.company} - ${MY_INFO.sologun}</p>
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
        return result === 'email_sent_successfully';
    } catch (err) {
        console.error('Error in sendEmail:', err);
        return false;
    }
}

export const sendPricingPaymentEmail = async (
    email: string,
    name: string,
    phone: string,
    planName: string,
    planPrice: string,
    paymentMethod: string,
    referenceCode: string,
    additionalInfo: string = '',
    imageUrls: string[] = []
): Promise<boolean> => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD,
            },
        });

        // Prepare attachments from image URLs (base64 strings)
        const attachments: Mail.Attachment[] = imageUrls.map((imageUrl, index) => {
            // Extract the base64 data from the data URL
            const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                return null;
            }

            const contentType = matches[1];
            const base64Data = matches[2];

            // Create a proper attachment object
            return {
                filename: `payment-proof-${index + 1}.${contentType.split('/')[1] || 'png'}`,
                content: base64Data,
                encoding: 'base64',
                contentType,
            };
        }).filter(Boolean) as Mail.Attachment[];

        // Gửi email cho người dùng 
        const userMailOptions: Mail.Options = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: `[${MY_INFO.company}] Xác nhận đăng ký gói học tập: ${planName}`,
            html: PRICING_EMAIL_TEMPLATE(
                name, email, phone, planName, planPrice,
                paymentMethod, referenceCode, additionalInfo,
                [], // Không gửi ảnh cho người dùng
                false
            ),
        };

        // Gửi email cho admin (có kèm ảnh)
        const adminMailOptions: Mail.Options = {
            from: process.env.MY_EMAIL,
            to: [process.env.MY_EMAIL as string, MY_INFO.email],
            subject: `[${MY_INFO.company}] Đăng ký gói học tập mới: ${planName} - ${name}`,
            html: PRICING_EMAIL_TEMPLATE(
                name, email, phone, planName, planPrice,
                paymentMethod, referenceCode, additionalInfo,
                [], // Don't embed images in HTML anymore
                true
            ),
            attachments: attachments, // Use proper email attachments instead
        };

        await transport.sendMail(userMailOptions);
        await transport.sendMail(adminMailOptions);

        return true;
    } catch (err) {
        console.error('Error in sendPricingPaymentEmail:', err);
        return false;
    }
}

// Adding a new function to support attachments for general emails
export const sendEmailWithAttachments = async (
    email: string,
    content: string,
    attachments: Mail.Attachment[] = []
): Promise<boolean> => {
    try {
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
            attachments: attachments,
        };

        await transport.sendMail(mailOptions);
        return true;
    } catch (err) {
        console.error('Error in sendEmailWithAttachments:', err);
        return false;
    }
}