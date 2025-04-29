'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendEmail } from '@/lib/actions/email.actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
    subject: z.string().min(5, { message: 'Tiêu đề phải có ít nhất 5 ký tự' }),
    message: z.string().min(10, { message: 'Nội dung phải có ít nhất 10 ký tự' }),
    experience: z.string(),
    interests: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất 1 lĩnh vực quan tâm' }),
    source: z.string(),
    availability: z.string(),
    agreeToTerms: z.boolean().refine(val => val === true, { message: 'Bạn cần đồng ý với điều khoản và điều kiện' }),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            experience: 'beginner',
            interests: [],
            source: '',
            availability: '',
            agreeToTerms: false,
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError('');

        try {
            // Format the email content
            const emailContent = `
        <h3>Thông tin liên hệ mới</h3>
        <p><strong>Họ tên:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Số điện thoại:</strong> ${data.phone}</p>
        <p><strong>Tiêu đề:</strong> ${data.subject}</p>
        <p><strong>Nội dung:</strong> ${data.message}</p>
        <p><strong>Kinh nghiệm:</strong> ${data.experience === 'beginner' ? 'Người mới bắt đầu' :
                    data.experience === 'intermediate' ? 'Đã có kinh nghiệm cơ bản' :
                        data.experience === 'advanced' ? 'Đã có kinh nghiệm tốt' : 'Chuyên gia'
                }</p>
        <p><strong>Lĩnh vực quan tâm:</strong> ${data.interests.join(', ')}</p>
        <p><strong>Thời gian có thể học:</strong> ${data.availability}</p>
        <p><strong>Biết đến từ:</strong> ${data.source}</p>
      `;

            // Send email
            const success = await sendEmail(data.email, emailContent);

            if (success) {
                setSubmitSuccess(true);
                reset();
            } else {
                setSubmitError('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitError('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInterestChange = (checked: boolean, value: string) => {
        setValue(
            'interests',
            checked
                ? [...(Array.isArray(getValues('interests')) ? getValues('interests') : []), value]
                : (getValues('interests') as string[]).filter(interest => interest !== value),
            { shouldValidate: true }
        );
    };

    if (submitSuccess) {
        return (
            <Card className="border-2 border-primary/20">
                <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">Gửi thành công!</h3>
                        <p className="text-muted-foreground">
                            Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                        </p>
                        <Button
                            onClick={() => setSubmitSuccess(false)}
                            className="mt-4"
                        >
                            Gửi yêu cầu khác
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gửi yêu cầu tư vấn</CardTitle>
                <CardDescription>
                    Điền đầy đủ thông tin dưới đây, chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {submitError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Họ tên <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="Nhập họ tên của bạn"
                                    {...register('name')}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...register('email')}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                                <Input
                                    id="phone"
                                    placeholder="0912345678"
                                    {...register('phone')}
                                    className={errors.phone ? 'border-red-500' : ''}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Tiêu đề <span className="text-red-500">*</span></Label>
                                <Input
                                    id="subject"
                                    placeholder="Nhập tiêu đề"
                                    {...register('subject')}
                                    className={errors.subject ? 'border-red-500' : ''}
                                />
                                {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Mức độ kinh nghiệm của bạn</Label>
                            <Select defaultValue="beginner" onValueChange={(value) => setValue('experience', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn mức độ kinh nghiệm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Người mới bắt đầu</SelectItem>
                                    <SelectItem value="intermediate">Đã có kinh nghiệm cơ bản</SelectItem>
                                    <SelectItem value="advanced">Đã có kinh nghiệm tốt</SelectItem>
                                    <SelectItem value="expert">Chuyên gia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Lĩnh vực quan tâm <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="frontend"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'Frontend')}
                                    />
                                    <Label htmlFor="frontend" className="cursor-pointer">Frontend (HTML, CSS, JS...)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="backend"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'Backend')}
                                    />
                                    <Label htmlFor="backend" className="cursor-pointer">Backend (Node.js, PHP...)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="fullstack"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'Fullstack')}
                                    />
                                    <Label htmlFor="fullstack" className="cursor-pointer">Fullstack</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="mobile"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'Mobile')}
                                    />
                                    <Label htmlFor="mobile" className="cursor-pointer">Mobile Development</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ai"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'AI/ML')}
                                    />
                                    <Label htmlFor="ai" className="cursor-pointer">AI/Machine Learning</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="other"
                                        onCheckedChange={(checked) => handleInterestChange(!!checked, 'Other')}
                                    />
                                    <Label htmlFor="other" className="cursor-pointer">Khác</Label>
                                </div>
                            </div>
                            {errors.interests && <p className="text-red-500 text-sm">{errors.interests.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="availability">Thời gian có thể học</Label>
                            <RadioGroup defaultValue="weekdays-evening" onValueChange={(value) => setValue('availability', value)}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="weekdays-evening" id="weekdays-evening" />
                                        <Label htmlFor="weekdays-evening" className="cursor-pointer">Tối các ngày trong tuần</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="weekdays-daytime" id="weekdays-daytime" />
                                        <Label htmlFor="weekdays-daytime" className="cursor-pointer">Ban ngày các ngày trong tuần</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="weekends" id="weekends" />
                                        <Label htmlFor="weekends" className="cursor-pointer">Cuối tuần</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="flexible" id="flexible" />
                                        <Label htmlFor="flexible" className="cursor-pointer">Linh hoạt</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="source">Bạn biết đến chúng tôi từ đâu?</Label>
                            <Select defaultValue="google" onValueChange={(value) => setValue('source', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nguồn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                    <SelectItem value="friend">Bạn bè giới thiệu</SelectItem>
                                    <SelectItem value="youtube">Youtube</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Nội dung <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="message"
                                placeholder="Nhập câu hỏi hoặc yêu cầu tư vấn của bạn"
                                rows={5}
                                {...register('message')}
                                className={errors.message ? 'border-red-500' : ''}
                            />
                            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="agreeToTerms"
                                onCheckedChange={(checked) => setValue('agreeToTerms', !!checked, { shouldValidate: true })}
                            />
                            <div>
                                <Label htmlFor="agreeToTerms" className="cursor-pointer">
                                    Tôi đồng ý với <a href="/terms" className="text-primary hover:underline">Điều khoản & Điều kiện</a> và <a href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</a>
                                </Label>
                                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 