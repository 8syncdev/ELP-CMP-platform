import { getPricing, checkPricingUserAuth } from '@/lib/actions/pricing';
import { PricingRegisterForm } from '@/components/pricing/pricing-register-form';
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, FileCheck, CreditCard } from 'lucide-react';
import { MarkdownRenderer } from '@/components/shared/dev/mdx';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getUserInfo } from '@/lib/actions/auth';

export const metadata = {
    title: 'Đăng ký khóa học',
    description: 'Hoàn thành đăng ký khóa học của bạn',
};

interface PricingRegisterPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PricingRegisterPage({ params }: PricingRegisterPageProps) {
    const { id } = await params;
    const getUserData = await getUserInfo();
    if (!getUserData.success) {
        redirect('/login');
    }
    return (
        <main className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-fade-in duration-1000 py-5">
                    Hoàn tất đăng ký
                </h1>
                <p className="mt-4 text-xl text-muted-foreground animate-slide-up [--slide-up-delay:200ms]">
                    Chỉ còn vài bước nữa để truy cập nội dung cao cấp
                </p>
            </div>

            <Suspense fallback={<PricingRegisterSkeleton />}>
                <PricingRegisterContent id={id} />
            </Suspense>
        </main>
    );
}

async function PricingRegisterContent({ id }: { id: string }) {
    // Validate that ID is a number
    const pricingId = parseInt(id, 10);
    if (isNaN(pricingId)) {
        notFound();
    }

    // Fetch pricing plan details
    const pricingData = await getPricing(pricingId);

    if (!pricingData.success || !pricingData.result) {
        notFound();
    }

    // Check if user already has this pricing plan
    const checkResult = await checkPricingUserAuth(pricingId);
    const hasActivePlan = checkResult.success && checkResult.result === true;

    const pricing = Array.isArray(pricingData.result)
        ? pricingData.result[0]
        : pricingData.result;

    return (
        <div className="grid gap-10 md:grid-cols-5 animate-fade-in [--fade-in-delay:300ms]">
            <div className="md:col-span-2 md:border-r md:pr-6">
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{pricing.name}</h2>

                        {pricing.sale > 0 && (
                            <div className="flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                <span>GIẢM {pricing.sale}%</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(pricing.price - (pricing.price * (pricing.sale / 100)))}
                            </p>

                            {pricing.sale > 0 && (
                                <p className="text-sm text-muted-foreground line-through">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(pricing.price)}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground mt-1">
                            {pricing.type_payment === 'monthly' ? 'Thanh toán hàng tháng' : 'Thanh toán hàng năm'}
                        </p>
                    </div>

                    <Separator className="my-6" />

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={pricing.description} />
                    </div>

                    <div className="mt-6 bg-muted p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                            <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-sm">Quy trình thanh toán</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sau khi gửi đơn đăng ký, đội ngũ của chúng tôi sẽ xác nhận thanh toán và kích hoạt tài khoản của bạn trong vòng 24 giờ.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link href="/pricing" passHref>
                            <Button variant="outline" size="sm" className="w-full">
                                Xem các gói khác
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 animate-slide-up [--slide-up-delay:500ms]">
                {hasActivePlan ? (
                    <Card className="bg-muted rounded-lg p-6 text-center">
                        <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Bạn đã đăng ký gói này!</h2>
                        <p className="text-muted-foreground mb-4">
                            Bạn đã đăng ký gói học tập này và hiện đang có quyền truy cập.
                        </p>
                        <p className="text-sm mb-6">
                            Nếu bạn muốn gia hạn hoặc có bất kỳ câu hỏi nào,
                            vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/profile?tab=subscriptions">
                                    Kiểm tra gói đã đăng ký
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/contact">
                                    Liên hệ hỗ trợ
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <PricingRegisterForm pricing={pricing} />
                )}
            </div>
        </div>
    );
}

function PricingRegisterSkeleton() {
    return (
        <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-2 md:pr-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-10 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/4 mb-6" />

                <Skeleton className="h-[1px] w-full my-6" />

                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />

                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>

                <Skeleton className="h-24 w-full mt-6 rounded-lg" />
            </div>

            <div className="md:col-span-3">
                <Skeleton className="h-[650px] w-full rounded-lg" />
            </div>
        </div>
    );
} 