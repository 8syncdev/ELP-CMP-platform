import { motion } from "framer-motion"

export function PricingHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-16"
        >
            <h1 className="text-4xl font-bold tracking-tight">
                Chọn Gói Phù Hợp Với Bạn
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cung cấp nhiều gói dịch vụ khác nhau để đáp ứng nhu cầu của bạn.
                Từ gói miễn phí cho người mới bắt đầu đến gói cao cấp cho người dùng chuyên nghiệp.
            </p>
        </motion.div>
    )
} 