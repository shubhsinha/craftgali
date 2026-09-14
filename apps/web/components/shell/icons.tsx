/**
 * The line-icon set. One stroke weight, one 24-grid, `currentColor` throughout,
 * so an icon takes the colour of whatever row it sits in.
 */

type IconProps = { size?: number; className?: string };

function Icon({ size = 18, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-6.5 8-12a8 8 0 1 0-16 0c0 5.5 8 12 8 12z" />
      <circle cx="12" cy="10" r="2.6" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </Icon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.4 12 20 12 20z" />
    </Icon>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5h16v11H9l-5 4V5z" />
    </Icon>
  );
}

export function StudioIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V9l8-5 8 5v11z" />
      <path d="M10 20v-6h4v6" />
    </Icon>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="6" />
      <rect x="3" y="15" width="7" height="6" />
      <rect x="14" y="12" width="7" height="9" />
    </Icon>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Icon>
  );
}

export function CheckIcon({ size = 9 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}
