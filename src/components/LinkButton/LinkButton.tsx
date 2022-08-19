import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './LinkButton.module.scss';

const LinkButton: FC<HTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button type="button" className={cn(styles.root, className)} {...props} />
  );
};

export default LinkButton;
