import { Metadata } from 'next';
import { ContactForm } from './_components/contact-form';
import { MY_INFO } from '@/constants/my-info';

export const metadata: Metadata = {
    title: `Liên hệ - ${MY_INFO.company}`,
    description: 'Liên hệ với chúng tôi để được tư vấn về các khóa học lập trình và công nghệ, hoặc gửi câu hỏi và phản hồi của bạn.',
    keywords: 'liên hệ, tư vấn, học lập trình, khóa học, mentor',
};

export default function ContactPage() {
    return (
        <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-fade-in">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground animate-slide-up [--slide-up-delay:200ms]">
                        Gửi yêu cầu tư vấn hoặc câu hỏi của bạn, chúng tôi sẽ phản hồi trong vòng 48 giờ
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in [--fade-in-delay:400ms]">
                    <div className="md:col-span-1">
                        <div className="bg-muted rounded-xl p-6 sticky top-20">
                            <h2 className="text-xl font-semibold mb-6">Thông tin liên hệ</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                    <p className="mt-1 text-base font-medium">{MY_INFO.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Hotline</h3>
                                    <p className="mt-1 text-base font-medium">{MY_INFO.contact}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Địa chỉ</h3>
                                    <p className="mt-1 text-base">{MY_INFO.address}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Giờ làm việc</h3>
                                    <p className="mt-1 text-base">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                                    <p className="text-base">Thứ 7: 9:00 - 12:00</p>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Kết nối với chúng tôi</h3>
                                    <div className="flex space-x-4">
                                        <a
                                            href={MY_INFO.socials.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                            <span className="sr-only">Facebook</span>
                                        </a>
                                        <a
                                            href={MY_INFO.socials.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                                            <span className="sr-only">YouTube</span>
                                        </a>
                                        <a
                                            href={MY_INFO.socials.zaloGroup}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                            <span className="sr-only">Zalo</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
} 