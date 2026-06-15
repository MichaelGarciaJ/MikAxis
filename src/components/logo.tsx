interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Logo({ width = 24, height = 24, className = "" }: LogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4L20 20M4 20L20 4"
        stroke="#38BDF8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="#0F172A"
        stroke="#38BDF8"
        strokeWidth="2"
      />
    </svg>
  );
}
