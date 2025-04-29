import { getPricings } from '@/lib/actions/pricing';
import { PricingCard } from '@/components/pricing/pricing-card';
import { Suspense } from 'react';
import { PricingPageSkeleton } from '@/components/pricing/pricing-page-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
    title: 'Pricing Plans',
    description: 'Choose the perfect plan for your learning journey',
};

export default async function PricingPage() {
    return (
        <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-fade-in duration-1000">
                    Choose Your Learning Plan
                </h1>
                <p className="mt-4 text-xl text-muted-foreground animate-slide-up [--slide-up-delay:200ms]">
                    Invest in your future with our flexible pricing options
                </p>
            </div>

            <Suspense fallback={<PricingPageSkeleton />}>
                <PricingPlans />
            </Suspense>
        </main>
    );
}

async function PricingPlans() {
    const pricingData = await getPricings();

    if (!pricingData.success || !pricingData.result) {
        return (
            <div className="text-center py-12 mt-10">
                <p className="text-lg text-muted-foreground">
                    Unable to load pricing plans. Please try again later.
                </p>
            </div>
        );
    }

    const pricingPlans = Array.isArray(pricingData.result)
        ? pricingData.result
        : [pricingData.result];

    // Separate monthly and annual plans
    const monthlyPlans = pricingPlans.filter(plan => plan.type_payment === 'monthly');
    const annualPlans = pricingPlans.filter(plan => plan.type_payment === 'annual');

    return (
        <div className="mt-16 animate-fade-in [--fade-in-delay:400ms]">
            <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="monthly">Monthly Plans</TabsTrigger>
                    <TabsTrigger value="annual">Annual Plans</TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="mt-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {monthlyPlans.map((plan, index) => (
                            <div key={plan.id} className="animate-slide-up" style={{ '--slide-up-delay': `${(index + 1) * 100 + 400}ms` } as React.CSSProperties}>
                                <PricingCard plan={plan} />
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="annual" className="mt-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {annualPlans.map((plan, index) => (
                            <div key={plan.id} className="animate-slide-up" style={{ '--slide-up-delay': `${(index + 1) * 100 + 400}ms` } as React.CSSProperties}>
                                <PricingCard plan={plan} featured={plan.sale > 0} />
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 