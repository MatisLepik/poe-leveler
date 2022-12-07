import { HTMLAttributes } from 'react';
import cn from 'classnames';

import UnstyledButton from '../UnstyledButton';

import styles from './NotificationAction.module.scss';

type NotificationActionProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function NotificationAction({
  label,
  className,
  ...props
}: NotificationActionProps) {
  return (
    <UnstyledButton
      {...props}
      aria-label={label}
      className={cn(styles.action, className)}
    />
  );
}
