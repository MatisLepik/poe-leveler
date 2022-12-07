import { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './PageRoot.module.scss';

type PageRootProps = InputHTMLAttributes<HTMLDivElement> & {
  noPadding?: boolean;
};

const PageRoot: FC<PageRootProps> = ({ className, noPadding, ...props }) => {
  return (
    <div
      className={cn(styles.root, className, { [styles.noPadding]: noPadding })}
      {...props}
    ></div>
  );
};

export default PageRoot;
