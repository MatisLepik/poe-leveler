import { FC, SVGAttributes } from 'react';

const ChevronLeft: FC<SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
      />
    </svg>
  );
};

export default ChevronLeft;
