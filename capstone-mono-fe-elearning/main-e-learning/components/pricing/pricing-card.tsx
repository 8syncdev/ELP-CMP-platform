'use client';

import { PricingDto } from '@/lib/actions/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/shared/dev/mdx';
import { Separator } from '@/components/ui/separator';

interface PricingCardProps {
    plan: PricingDto;
    featured?: boolean;
}

export function PricingCard({ plan, featured = false }: PricingCardProps) {
    const [mounted, setMounted] = useState(false);

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate the discounted price if there's a sale
    const displayPrice = plan.sale > 0
        ? plan.price - (plan.price * (plan.sale / 100))
        : plan.price;

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(displayPrice);

    // Features (example - in a real app these would come from the backend)
    const features = [
        'Access to all courses',
        'Premium learning materials',
        'Certificate of completion',
        'Community access'
    ];

    return (
        <Card className={cn(
            "h-full flex flex-col transition-all duration-300 group hover:shadow-lg",
            featured && "border-primary/50 shadow-md",
            mounted && "hover:translate-y-[-4px]"
        )}>
            <CardHeader className="text-center relative">
                {plan.sale > 0 && mounted && (
                    <Badge
                        variant="destructive"
                        className="absolute top-2 right-2 animate-bounce-subtle"
                    >
                        {plan.sale}% OFF
                    </Badge>
                )}

                <CardTitle className="text-2xl">{plan.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <div className="text-center mb-6">
                    {plan.sale > 0 && (
                        <span className="text-muted-foreground line-through mr-2 text-sm">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(plan.price)}
                        </span>
                    )}
                    <span className="text-4xl font-bold">{formattedPrice}</span>
                    <span className="text-muted-foreground ml-1">/{plan.type_payment}</span>
                </div>

                <Separator className="my-4" />

                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MarkdownRenderer content={plan.description} />
                </div>
            </CardContent>

            <CardFooter>
                <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Link href={`/pricing/register/${plan.id}`}>
                        Choose Plan
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
} 