import { SVGProps } from 'react';

// ----------------------------------------------------------------

const PopularIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <rect width={28} height={28} fill="currentColor" rx={6} />
    <path
      fill="#EEA956"
      d="M10.721 18.45 13 20.89c.226.236.64.065.64-.256v-2.162h1.81c.986 0 1.787-.835 1.787-1.862V8.861C17.238 7.834 16.437 7 15.45 7H5.79C4.801 7 4 7.834 4 8.861v7.728c0 1.027.802 1.861 1.788 1.861h4.933Zm-2.61-7.02 1.603-.13.617-1.561c.123-.3.514-.3.617 0l.616 1.562 1.604.128c.308.021.431.407.185.62l-1.234 1.092.39 1.626c.083.3-.246.556-.513.385l-1.377-.877-1.377.877c-.268.171-.576-.086-.514-.385l.39-1.626-1.233-1.091c-.206-.193-.082-.6.226-.62Zm11.45-1.328c-.453 0-.823-.385-.823-.855 0-.471.37-.856.822-.856h3.618c.452 0 .822.385.822.856 0 .47-.37.855-.822.855H19.56Zm-.802 2.547c0-.471.37-.856.822-.856h2.672c.452 0 .822.385.822.856 0 .47-.37.856-.822.856H19.56c-.452 0-.801-.386-.801-.856Zm0 3.402c0-.47.37-.856.822-.856h1.624c.452 0 .822.385.822.856 0 .47-.37.856-.822.856H19.56c-.452 0-.801-.386-.801-.856Z"
    />
  </svg>
);
export default PopularIcon;