import { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Label.module.scss';

type LabelProps = {
  name: ReactNode;
  children: ReactNode;
  as?: 'div' | 'label';
  className?: string;
  inputWrapperClassName?: string;
  sticky?: boolean;
};

const Label: FC<LabelProps> = ({
  children,
  name,
  className,
  inputWrapperClassName,
  as: As = 'label',
  sticky,
}) => {
  return (
    <As className={cn(styles.root, className)}>
      <div className={cn(styles.name, { [styles.sticky]: sticky })}>{name}</div>
      <div className={cn(styles.inputWrapper, inputWrapperClassName)}>
        {children}
      </div>
    </As>
  );
};

export default Label;
