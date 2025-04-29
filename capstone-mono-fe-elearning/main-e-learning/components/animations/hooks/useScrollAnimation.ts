import { useInView } from 'framer-motion'
import { useRef } from 'react'

export const useScrollAnimation = (threshold = 0.2) => {
    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: true,
        amount: threshold,
        margin: "-50px 0px"
    })

    return { ref, isInView }
} 