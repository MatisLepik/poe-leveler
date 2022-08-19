import cn from 'classnames';
import { useEffect, useState } from 'react';
import type { Notification as NotificationType } from '../../types';
import AnimateHeight from 'react-animate-height';

import styles from './Notification.module.scss';

type NotificationProps = {
  notification: NotificationType;
  remove: (id: string) => void;
  className?: string;
};

const formatter = Intl.DateTimeFormat('default', {
  hour: '2-digit',
  minute: '2-digit',
});

export default function Notification({
  notification,
  className,
}: NotificationProps) {
  const Icon = notification.logo;
  const [height, setHeight] = useState<'auto' | 0>(0);

  useEffect(() => {
    setHeight('auto');
  }, []);

  return (
    <AnimateHeight role="listitem" duration={500} height={height}>
      <div className={cn(styles.root, className)}>
        <Icon className={styles.icon} />
        <div className={styles.text}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{notification.title}</h3>
            <time
              dateTime={notification.createdAt.toISOString()}
              className={styles.timestamp}
            >
              {formatter.format(notification.createdAt)}
            </time>
          </div>
          <div className={styles.content}>{notification.content}</div>
        </div>
      </div>
    </AnimateHeight>
  );
}
