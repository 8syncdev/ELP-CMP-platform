'use client'

import React from 'react'
import { IntroSection, ExerciseSection, LessonSection, ContactSection, TrialAiSection } from './sections'
import HomeEntrance from './home-entrance'
import { useEffect, useState } from 'react'

export const HomePage = () => {
    const [hasVisited, setHasVisited] = useState(true)
    const [showIntro, setShowIntro] = useState(false)

    useEffect(() => {
        const visited = localStorage.getItem('hasVisitedHome')
        if (!visited) {
            setHasVisited(false)
            localStorage.setItem('hasVisitedHome', 'true')
        } else {
            setShowIntro(true)
        }
    }, [])

    const handleEntranceComplete = () => {
        setShowIntro(true)
    }

    return (
        <main id="home-page">
            {!hasVisited && (
                <HomeEntrance onComplete={handleEntranceComplete} />
            )}
            {showIntro && (
                <>
                    <IntroSection />
                    <TrialAiSection />
                    <ExerciseSection />
                    <LessonSection />
                    <ContactSection />
                </>

            )}
        </main>
    )
}
