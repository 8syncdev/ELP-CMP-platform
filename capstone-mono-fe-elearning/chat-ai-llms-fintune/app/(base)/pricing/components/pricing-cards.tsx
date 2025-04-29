import { pricingPlans } from "../data"
import { PricingCard } from "./pricing-card"
import { motion } from "framer-motion"

export function PricingCards() {
    return (
        <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                >
                    <PricingCard plan={plan} />
                </motion.div>
            ))}
        </div>
    )
} 