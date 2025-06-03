import type { SVGProps } from 'react';

export function RailwayCrossingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
      <path d="M5 21h14" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
    </svg>
  );
}
