import { FC, forwardRef, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={cn(className, styles.root)} {...props} />;
});

export default Input;
