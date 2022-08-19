import { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input: FC<InputProps> = ({ className, ...props }) => {
  return <input className={cn(className, styles.root)} {...props} />;
};

export default Input;
