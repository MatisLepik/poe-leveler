import { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './PageRoot.module.scss';

const PageRoot: FC<InputHTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn(styles.root, className)} {...props}></div>;
};

export default PageRoot;
