'use client';

import { motion } from "framer-motion";

export function LoadingIndicator() {
    return (
        <motion.div
            className="flex items-center gap-2 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0
                }}
            />
            <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.2
                }}
            />
            <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.4
                }}
            />
        </motion.div>
    );
} 