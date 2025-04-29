import { getExerciseBySlug } from '@/lib/actions/exercise'
import React from 'react'
import { ExerciseContent } from './_components'
import { notFound } from 'next/navigation'
import { getUserInfo } from '@/lib/actions/auth'
import { checkAllPricingUserAuth } from '@/lib/actions/pricing'

interface Props {
    params: Promise<{
        slug: string
    }>

}

const page = async ({ params }: Props) => {
    const { slug } = await params
    const exercise = await getExerciseBySlug(slug)
    console.log(exercise)
    if (!exercise?.result || Array.isArray(exercise.result)) {
        return notFound()
    }

    // Determine if we should show solutions
    let allowShowSolution = false;

    // Always show solutions for free exercises
    if (exercise.result.metadata.privilege === 'free') {
        allowShowSolution = true;
    } else {
        // For premium exercises, check user auth and pricing subscription
        const userInfo = await getUserInfo();

        if (userInfo.success) {
            // User is logged in, now check if they have any active pricing plan
            const pricingAccess = await checkAllPricingUserAuth();
            allowShowSolution = pricingAccess.success && !!pricingAccess.result;
        }
    }

    // console.log(exercise.result.metadata.privilege, allowShowSolution)
    return (
        <main className="h-full">
            <ExerciseContent exercise={exercise.result} allowShowSolution={allowShowSolution} />
        </main>
    )
}

export default page