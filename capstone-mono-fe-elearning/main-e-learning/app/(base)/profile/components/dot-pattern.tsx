"use client";

import React from "react";

interface DotPatternProps {
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
}

export function DotPattern({
    width = 16,
    height = 16,
    cx = 0.5,
    cy = 0.5,
    cr = 0.5,
    className = "",
}: DotPatternProps) {
    const patternId = React.useId();

    return (
        <div className={className}>
            <svg className="absolute inset-0 h-full w-full">
                <defs>
                    <pattern
                        id={patternId}
                        width={width}
                        height={height}
                        patternUnits="userSpaceOnUse"
                        patternContentUnits="userSpaceOnUse"
                    >
                        <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
        </div>
    );
} 