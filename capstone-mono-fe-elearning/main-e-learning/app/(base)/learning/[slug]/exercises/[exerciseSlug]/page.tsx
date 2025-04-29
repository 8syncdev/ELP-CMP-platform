import React from 'react'

interface Props {
    params: Promise<{
        slug: string
        exerciseSlug: string
    }>
}

const page = async ({ params }: Props) => {
    const { slug, exerciseSlug } = await params
    return (
        <div>page</div>
    )
}

export default page