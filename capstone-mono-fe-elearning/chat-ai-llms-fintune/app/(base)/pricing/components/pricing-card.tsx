import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { pricingPlans } from "../data"

interface PricingCardProps {
    plan: (typeof pricingPlans)[number]
}

export function PricingCard({ plan }: PricingCardProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="mb-6">
                    <span className="text-3xl font-bold">
                        {plan.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-muted-foreground">/tháng</span>
                </div>
                <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                        </motion.li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant={plan.id === 'vip' ? 'default' : 'outline'}>
                    Chọn gói {plan.name}
                </Button>
            </CardFooter>
        </Card>
    )
} 