"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 32, height = 32 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height} 
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      {/* Core Logo Shape - Infinity Symbol */}
      <g className="logo-core">
        <path
          d="M10 7C10 3.5 12.5 1 16 1C19.5 1 22 3.5 22 7C22 10.5 19.5 13 16 13C12.5 13 10 10.5 10 7Z"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(90 16 16)"
        >
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="2s" repeatCount="indefinite"/>
        </path>
        <path
          d="M10 25C10 21.5 12.5 19 16 19C19.5 19 22 21.5 22 25C22 28.5 19.5 31 16 31C12.5 31 10 28.5 10 25Z"
          fill="currentColor"
          opacity="0.9"
          transform="rotate(90 16 16)"
        >
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* Tech Pattern Layer */}
      <g className="tech-pattern">
        <path
          d="M4 16H28M2 12L6 16L2 20M30 12L26 16L30 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tech-overlay"
        >
          <animate attributeName="stroke-width" values="1.5;1;1.5" dur="2s" repeatCount="indefinite"/>
        </path>

        <path
          d="M8 4H24M8 28H24M4 8V24M28 8V24"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.6"
          className="circuit-matrix"
        >
          <animate attributeName="stroke-dashoffset" values="4;0" dur="1s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* Digital Elements */}
      <g className="digital-elements">
        <text x="13" y="8" fill="currentColor" fontSize="2.5" opacity="0.7" className="digital-text">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
          10
        </text>
        <text x="17" y="8" fill="currentColor" fontSize="2.5" opacity="0.7" className="digital-text">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
          01
        </text>
        <text x="13" y="27" fill="currentColor" fontSize="2.5" opacity="0.7" className="digital-text">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" begin="0.75s"/>
          01
        </text>
        <text x="17" y="27" fill="currentColor" fontSize="2.5" opacity="0.7" className="digital-text">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" begin="1s"/>
          10
        </text>
      </g>

      {/* Interactive Nodes */}
      <g className="interactive-nodes">
        <circle cx="6" cy="16" r="2" fill="currentColor" className="pulse-node">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="2;2.5;2" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="26" cy="16" r="2" fill="currentColor" className="pulse-node">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="2;2.5;2" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Connection Points */}
      <g className="connection-points">
        <circle cx="16" cy="12" r="1.5" fill="currentColor" className="glow-point">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="16" cy="20" r="1.5" fill="currentColor" className="glow-point">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Circuit Elements */}
      <g className="circuit-elements">
        <path
          d="M16 12V20M4 8L8 12M28 8L24 12M4 24L8 20M28 24L24 20"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
          className="circuit-path"
        >
          <animate attributeName="stroke-width" values="1;1.5;1" dur="2s" repeatCount="indefinite"/>
        </path>

        <path
          d="M14 6L18 6M14 26L18 26M6 14L6 18M26 14L26 18"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.4"
          className="hex-pattern"
        >
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* Data Flow Patterns */}
      <g className="data-flow">
        <path
          d="M12 14L20 14M12 18L20 18M14 12L14 20M18 12L18 20"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1 2"
          opacity="0.5"
          className="data-stream"
        >
          <animate attributeName="stroke-dashoffset" values="6;0" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* Border Details */}
      <g className="border-details">
        <path
          d="M3 3L7 7M29 3L25 7M3 29L7 25M29 29L25 25"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.4"
          className="corner-detail"
        >
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite"/>
        </path>

        <path
          d="M10 2H22M2 10V22M30 10V22M10 30H22"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 3"
          opacity="0.3"
          className="border-pattern"
        >
          <animate attributeName="stroke-dashoffset" values="4;0" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  )
}
