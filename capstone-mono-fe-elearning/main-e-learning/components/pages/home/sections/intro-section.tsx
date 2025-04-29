import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CodeBlock } from '@/components/shared/dev/mdx/components/code-block'
import { MY_INFO } from '@/constants/my-info'
import { ArrowRight, BookOpen, Code2, Github, MessageSquare, Rocket, Sparkles, Youtube } from 'lucide-react'
import { Logo } from '@/components/shared/common/logo/main'
import { useScrollAnimation } from '@/components/animations/hooks/useScrollAnimation'
import {
    staggerContainerVariants,
    slideUpVariants,
    frameLineVariants,
    scaleVariants,
    fadeInVariants
} from '@/components/animations'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
}

// Code typing component with optimization
const CodeAutoTyping = React.memo(({ code }: { code: string }) => {
    return (
        <CodeBlock
            language="typescript"
            enableTyping={true}
            typingSpeed={40}
            loop={true}
            typingDelay={2000}
            showLineNumbers={true}
            showCopyButton={false}
            isCodeBlock={true}
            wrapModeDev={true}
        >
            {code}
        </CodeBlock>
    )
})
CodeAutoTyping.displayName = 'CodeAutoTyping'

// Animated Feature Item
const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <motion.div
        variants={slideUpVariants}
        className="flex items-center gap-3 hover:scale-105 transition-transform"
    >
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
        </div>
        <span className="text-lg text-muted-foreground">{text}</span>
    </motion.div>
)

// Animated CTA Button
const CTAButton = React.memo(({ href, variant = "default", icon, text, external = false }: {
    href: string;
    variant?: "default" | "secondary" | "outline";
    icon: React.ReactNode;
    text: string;
    external?: boolean;
}) => (
    <Link href={href} target={external ? "_blank" : undefined}>
        <motion.div
            variants={scaleVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button size="lg" variant={variant} className="group text-lg">
                {icon}
                <span className="mx-2">{text}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </motion.div>
    </Link>
))
CTAButton.displayName = 'CTAButton'

// Code Examples
const CodeExamples = {
    left: `// TypeScript Example
interface Developer {
    name: string;
    skills: string[];
    description: string;
}

const dev: Developer = {
    name: "${MY_INFO.company}",
    skills: ${JSON.stringify(MY_INFO.techStack.backend)},
    description: "${MY_INFO.description}"
};`,

    right: `// React Component Example
function LearningPath() {
    const topics = [
        "Algorithms",
        "Data Structures",
        "Web Development",
        "AI Integration"
    ];
    
    return (
        <div className="learning">
            {topics.map(topic => (
                <Module key={topic}>
                    {topic}
                </Module>
            ))}
        </div>
    );
}`
}

// Animated Frame Line
const FrameLine = () => (
    <motion.div
        variants={frameLineVariants}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
    />
)

export const IntroSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
        >
            {/* Top Frame Line */}
            <motion.div
                variants={frameLineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
            />

            {/* Background Gradient */}
            <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
            />

            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainerVariants}
                className="container mx-auto py-16 md:py-24"
            >
                {/* Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
                    {/* Left Code Block */}
                    <motion.div variants={slideUpVariants} className='hidden md:block'>
                        <CodeAutoTyping code={CodeExamples.left} />
                    </motion.div>

                    {/* Center Content */}
                    <div className='space-y-8 text-center'>
                        <LogoSection />
                        <Title />
                        <Features />
                        <CTAButtons />
                    </div>

                    {/* Right Code Block */}
                    <motion.div variants={slideUpVariants} className='hidden md:block'>
                        <CodeAutoTyping code={CodeExamples.right} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Frame Line */}
            <motion.div
                variants={frameLineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
            />
        </section>
    )
}

// Sub-components
const LogoSection = () => (
    <motion.div
        variants={scaleVariants}
        className="relative"
    >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30" />
        <Logo className="w-20 h-20 mx-auto relative animate-float" />
    </motion.div>
)

const Title = () => (
    <motion.h1
        variants={slideUpVariants}
        className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
    >
        {MY_INFO.sologun}
    </motion.h1>
)

const Features = () => (
    <motion.div
        variants={staggerContainerVariants}
        className="flex flex-col gap-4"
    >
        <FeatureItem icon={<Code2 className="w-5 h-5" />} text="Học lập trình từ cơ bản đến nâng cao" />
        <FeatureItem icon={<Rocket className="w-5 h-5" />} text="Xây dựng dự án thực tế" />
        <FeatureItem icon={<Github className="w-5 h-5" />} text="Tham gia cộng đồng lập trình viên" />
    </motion.div>
)

const CTAButtons = () => (
    <motion.div
        variants={staggerContainerVariants}
        className="flex flex-wrap justify-center gap-4"
    >
        <CTAButton
            href="#exercise-section"
            icon={<Code2 className="w-5 h-5" />}
            text="Bắt đầu học ngay 700+ bài tập"
        />
        <CTAButton
            href="#lesson-section"
            variant="secondary"
            icon={<BookOpen className="w-5 h-5" />}
            text="Bắt đầu học ngay 100+ bài học"
        />
        <CTAButton
            href="#trial-ai-section"
            variant="outline"
            icon={<Sparkles className="w-5 h-5" />}
            text="Dùng AI miễn phí"
        />
        <CTAButton
            href={MY_INFO.socials.youtube}
            icon={<Youtube className="w-5 h-5" />}
            text="Xem video tutorial miễn phí"
            external
        />
    </motion.div>
)
