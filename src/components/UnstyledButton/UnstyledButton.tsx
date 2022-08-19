import { HTMLAttributes } from 'react';

import styles from './UnstyledButton.module.scss';

export default function UnstyledButton({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`${styles.root} ${className || ''}`}
    ></button>
  );
}
