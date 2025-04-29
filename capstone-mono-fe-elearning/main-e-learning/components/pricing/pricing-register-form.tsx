'use client';

import { useState } from 'react';
import { PricingDto, createPricingUserAuth } from '@/lib/actions/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle, Loader2, Copy, FileCheck, Info } from 'lucide-react';
import { FileUpload, FileWithPreview } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';
import { sendPricingPaymentEmail } from '@/lib/actions/email.actions';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MY_INFO } from '@/constants/my-info';

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Vui lòng nhập email hợp lệ'),
    phone: z.string().min(10, 'Vui lòng nhập số điện thoại hợp lệ'),
    additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PricingRegisterFormProps {
    pricing: PricingDto;
}

export function PricingRegisterForm({ pricing }: PricingRegisterFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
    const [copiedBank, setCopiedBank] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    // Form definition
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            additionalInfo: '',
        },
    });

    // Calculate the final price
    const finalPrice = pricing.price - (pricing.price * (pricing.sale / 100));
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(finalPrice);

    // Handle file upload
    const handleFileChange = (files: FileWithPreview[]) => {
        setUploadedFiles(files);
    };

    // Convert files to base64 for email attachment
    const getBase64Images = async (files: File[]): Promise<string[]> => {
        const promises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        });

        return Promise.all(promises);
    };

    // Copy bank info to clipboard
    const copyToClipboard = (text: string, bankName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedBank(bankName);
        toast({
            title: 'Đã sao chép',
            description: 'Thông tin đã được sao chép vào clipboard',
            variant: 'default',
        });

        setTimeout(() => {
            setCopiedBank(null);
        }, 3000);
    };

    // Handle form submission
    async function onSubmit(data: FormValues) {
        if (uploadedFiles.length === 0) {
            toast({
                title: 'Chưa có minh chứng thanh toán',
                description: 'Vui lòng tải lên ảnh chụp màn hình thanh toán',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert files to base64 for email
            const imageUrls = await getBase64Images(uploadedFiles);

            // Send email with payment details
            const emailSent = await sendPricingPaymentEmail(
                data.email,
                data.name,
                data.phone,
                pricing.name,
                formattedPrice,
                'Chuyển khoản ngân hàng',
                referenceCode,
                data.additionalInfo || '',
                imageUrls
            );

            if (!emailSent) {
                throw new Error('Không thể gửi thông tin thanh toán');
            }

            // Register user to pricing
            const result = await createPricingUserAuth({
                pricing_id: pricing.id
            });

            if (result.success) {
                setPaymentSuccess(true);
                toast({
                    title: 'Đăng ký thành công!',
                    description: 'Thông tin thanh toán của bạn đã được gửi. Chúng tôi sẽ xử lý trong thời gian sớm nhất.',
                    variant: 'default',
                });

                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            } else {
                throw new Error(result.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            let errorTitle = 'Đăng ký thất bại';
            let errorMessage = error instanceof Error ? error.message : 'Vui lòng thử lại sau';

            // Check for the specific database constraint error for duplicate registration
            if (error instanceof Error &&
                (error.message.includes('duplicate key') ||
                    error.message.includes('pricing_users_pkey') ||
                    (typeof error === 'object' &&
                        error !== null &&
                        'internal_message' in error &&
                        typeof error.internal_message === 'string' &&
                        error.internal_message.includes('duplicate key value violates unique constraint "pricing_users_pkey"')))) {

                errorTitle = 'Đã đăng ký trước đó';
                errorMessage = 'Bạn đã đăng ký gói học tập này rồi. Vui lòng kiểm tra trang khóa học của bạn.';
            }

            toast({
                title: errorTitle,
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Generate a reference code
    const referenceCode = `PRICING_${pricing.id}_${Math.floor(Math.random() * 1000000)}`;

    if (paymentSuccess) {
        return (
            <Card className="w-full animate-fade-in">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Đã gửi thông tin thành công!</CardTitle>
                    <CardDescription>
                        Thông tin đăng ký của bạn đã được tiếp nhận
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        Chúng tôi đã nhận được thông tin thanh toán và sẽ xử lý trong thời gian sớm nhất.
                        Bạn sẽ nhận được email xác nhận khi quá trình đăng ký hoàn tất.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push('/')}>
                        Đi đến Trang chủ
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Đăng ký gói học tập</CardTitle>
                <CardDescription>
                    Hoàn tất thông tin đăng ký để truy cập nội dung khóa học
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Thông tin liên hệ</h3>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập họ và tên của bạn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Số điện thoại của bạn" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Thông tin thanh toán</h3>

                            <div className="rounded-md bg-muted p-4">
                                <div className="space-y-4">
                                    <p className="font-medium">Thông tin chuyển khoản</p>

                                    {MY_INFO.banking.map((bank, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-md border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div>
                                                <p className="font-medium">{bank.name}</p>
                                                <p className="text-sm text-muted-foreground">Số tài khoản: <span className="font-medium text-foreground">{bank.number}</span></p>
                                                <p className="text-sm text-muted-foreground">Chủ tài khoản: {bank.owner}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full sm:w-auto gap-1.5"
                                                onClick={() => copyToClipboard(bank.number, bank.name)}
                                            >
                                                {copiedBank === bank.name ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4" />
                                                        Đã sao chép
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        Sao chép STK
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="flex flex-col gap-2 mt-2">
                                        <p className="text-sm font-medium">Nội dung chuyển khoản:</p>
                                        <div className="flex items-center gap-2">
                                            <code className="relative rounded bg-muted px-[0.5rem] py-[0.25rem] font-mono text-sm">
                                                {referenceCode}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => copyToClipboard(referenceCode, 'reference')}
                                            >
                                                {copiedBank === 'reference' ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Alert className="bg-amber-50 border-amber-200">
                                <Info className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-800">Lưu ý quan trọng</AlertTitle>
                                <AlertDescription className="text-amber-700">
                                    Sau khi chuyển khoản, vui lòng tải lên ảnh chụp màn hình giao dịch hoặc hóa đơn chuyển khoản để chúng tôi xác nhận thanh toán của bạn.
                                </AlertDescription>
                            </Alert>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileCheck className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium text-base">Tải lên minh chứng thanh toán</h4>
                                </div>

                                <FileUpload
                                    multiple
                                    maxFiles={3}
                                    accept={{
                                        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                                        'application/pdf': ['.pdf'],
                                    }}
                                    value={uploadedFiles}
                                    onChange={handleFileChange}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="additionalInfo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thông tin bổ sung (nếu có)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Thông tin thêm về thanh toán của bạn"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex justify-between mb-2">
                                <span>Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.price)}</span>
                            </div>

                            {pricing.sale > 0 && (
                                <div className="flex justify-between mb-2 text-primary">
                                    <span>Giảm giá ({pricing.sale}%)</span>
                                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricing.price * (pricing.sale / 100))}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng thanh toán</span>
                                <span>{formattedPrice}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý
                                </>
                            ) : (
                                `Hoàn tất đăng ký`
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 