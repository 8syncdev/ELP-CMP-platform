// components/pages/home/HomeEntrance.tsx
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MY_INFO } from '@/constants/my-info'

const GalaxyEntranceBackground = dynamic(
    () => import('@/components/shared/dev/canvas3d/galaxyentrance-bg'),
    { ssr: false }
)

interface HomeEntranceProps {
    onComplete: () => void;
}

const HomeEntrance = ({ onComplete }: HomeEntranceProps) => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true)
            setTimeout(onComplete, 1000)
        }, 5000)

        return () => clearTimeout(timer)
    }, [onComplete])

    return !showContent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <GalaxyEntranceBackground
                maxStars={2000}
                starSizeMin={2}
                starSizeMax={4}
                starSpeedFactor={50000}
                entranceDuration={5000}
                hue={217}
            />
            <h1 className="absolute text-4xl md:text-6xl font-bold text-center text-primary">
                Chào mừng bạn đến với {MY_INFO.company}
            </h1>
        </div>
    ) : null
}

export default HomeEntrance