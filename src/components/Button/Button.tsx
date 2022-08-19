import { ButtonHTMLAttributes } from 'react';

import UnstyledButton from '../UnstyledButton';

import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'large' | 'massive';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

export default function Button({
  className,
  size = 'large',
  variant = 'primary',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <UnstyledButton
      {...props}
      aria-disabled={disabled}
      onClick={disabled ? () => null : onClick}
      className={`${styles.root} ${styles[variant]} ${styles[size]} ${
        className || ''
      }`}
    ></UnstyledButton>
  );
}
