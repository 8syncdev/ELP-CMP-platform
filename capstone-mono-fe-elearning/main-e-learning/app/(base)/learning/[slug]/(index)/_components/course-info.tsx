'use client';

import { CourseDto } from '@/lib/actions/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, GraduationCap, Mail, Phone } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CourseInfoProps {
    course: CourseDto;
}

export function CourseInfo({ course }: CourseInfoProps) {
    const { metadata } = course;

    const infoItems = [
        {
            icon: Clock,
            label: 'Thời lượng',
            value: metadata.duration
        },
        {
            icon: GraduationCap,
            label: 'Trình độ',
            value: metadata.level
        },
        {
            icon: Mail,
            label: 'Email',
            value: metadata.instructor_email
        },
        {
            icon: Phone,
            label: 'Liên hệ',
            value: metadata.instructor_contact
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {infoItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="font-medium">{item.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Học phí</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Giá gốc</p>
                        <p className="text-xl font-bold line-through text-muted-foreground">
                            {formatPrice(metadata.original_price)}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Giá ưu đãi</p>
                        <p className="text-2xl font-bold text-primary">
                            {formatPrice(metadata.discounted_price)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 