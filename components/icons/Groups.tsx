import { SVGProps } from 'react';

// ----------------------------------------------------------------

const GroupsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <ellipse cx={10} cy={15} fill="currentColor" rx={6} ry={3} />
    <circle cx={10} cy={6} r={4} fill="currentColor" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.25 3.468A3.499 3.499 0 0 0 3.5 6.5c0 1.295.704 2.427 1.75 3.032a3.5 3.5 0 1 1 0-6.064ZM14.75 3.468A3.499 3.499 0 0 1 16.5 6.5a3.499 3.499 0 0 1-1.75 3.032 3.5 3.5 0 1 0 0-6.064ZM15.5 12a2.5 2.5 0 0 1 2 4 2.5 2.5 0 1 0-2-4ZM4.5 12a2.5 2.5 0 0 0-2 4 2.5 2.5 0 1 1 2-4Z"
      clipRule="evenodd"
    />
    <circle cx={16.5} cy={3.5} r={3} fill="#825EF6" stroke="#E8E1FF" />
  </svg>
);
export default GroupsIcon;
