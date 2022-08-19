import { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './ContentWrapper.module.scss';

const ContentWrapper: FC<InputHTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn(styles.root, className)} {...props}></div>;
};

export default ContentWrapper;
