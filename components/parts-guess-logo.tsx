import type React from "react"

interface PartsGuessLogoProps {
  width?: number
  height?: number
  className?: string
  showText?: boolean
}

export const PartsGuessLogo: React.FC<PartsGuessLogoProps> = ({
  width = 60,
  height = 60,
  className = "",
  showText = true,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="100" cy="85" r="65" fill="#1e293b" />

      {/* Blueprint grid lines */}
      <path d="M45 85 L155 85" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M100 30 L100 140" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />

      {/* Small grid lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={`h-line-${i}`}
          d="M45 70 L155 70"
          stroke="#3b82f6"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          transform={`translate(0, ${i * 10 - 35})`}
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={`v-line-${i}`}
          d="M85 30 L85 140"
          stroke="#3b82f6"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          transform={`translate(${i * 10 - 35}, 0)`}
        />
      ))}

      {/* Outer ring */}
      <circle cx="100" cy="85" r="65" stroke="#3b82f6" strokeWidth="6" fill="none" />

      {/* Piston body */}
      <rect x="70" y="55" width="60" height="80" rx="5" fill="#3b82f6" />

      {/* Piston top */}
      <rect x="70" y="45" width="60" height="15" rx="3" fill="#3b82f6" />

      {/* Piston rings */}
      <rect x="70" y="70" width="60" height="5" fill="#1e293b" />
      <rect x="70" y="85" width="60" height="5" fill="#1e293b" />
      <rect x="70" y="100" width="60" height="5" fill="#1e293b" />

      {/* Piston pin */}
      <rect x="60" y="115" width="80" height="10" rx="5" fill="#f97316" />

      {/* Connecting rod */}
      <path d="M100 125 L100 150" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />

      {/* Measurement lines */}
      <path d="M140 45 L150 45" stroke="#f8fafc" strokeWidth="2" />
      <path d="M140 135 L150 135" stroke="#f8fafc" strokeWidth="2" />
      <path d="M145 45 L145 135" stroke="#f8fafc" strokeWidth="2" />
      <path d="M142 90 L148 90" stroke="#f8fafc" strokeWidth="2" />

      {/* Text - Only show if showText is true */}
      {showText && (
        <g transform="translate(0, 25)">
          <rect x="40" y="155" width="120" height="24" fill="#1e293b" rx="6" />
          <text
            x="100"
            y="173"
            textAnchor="middle"
            fontFamily="Outfit, sans-serif"
            fontWeight="600"
            fontSize="18"
            letterSpacing="0.5"
            fill="#f8fafc"
          >
            Parts<tspan fill="#f97316">Guess</tspan>
          </text>
        </g>
      )}
    </svg>
  )
}

export default PartsGuessLogo
