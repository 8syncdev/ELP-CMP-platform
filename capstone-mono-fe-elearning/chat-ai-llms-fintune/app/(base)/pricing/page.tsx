"use client"

import { PricingCards } from "./components/pricing-cards"
import { PricingHeader } from "./components/pricing-header"
import { motion } from "framer-motion"

export default function PricingPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container max-w-7xl py-16 mx-auto"
        >
            <PricingHeader />
            <PricingCards />
        </motion.div>
    )
}
