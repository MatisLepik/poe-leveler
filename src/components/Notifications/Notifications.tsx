import cn from 'classnames';

import type { Notification as NotificationType } from '../../types';
import Notification from '../Notification';
import UnstyledButton from '../UnstyledButton';

import styles from './Notifications.module.scss';
import ChevronLeft from '../icons/ChevronLeft';

type NotificationsProps = {
  notifications: NotificationType[];
  removeNotification: (id: string) => void;
  isOpen: boolean;
  toggle: () => void;
};

export default function Notifications({
  notifications,
  removeNotification,
  isOpen,
  toggle,
}: NotificationsProps) {
  if (notifications.length === 0) return null;

  return (
    <div className={cn(styles.root, { [styles.isOpen]: isOpen })}>
      <UnstyledButton
        aria-label="Toggle drawer"
        className={styles.toggler}
        onClick={toggle}
      >
        <ChevronLeft className={styles.togglerIcon} />
      </UnstyledButton>
      <ol className={styles.notifications}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            className={styles.notification}
            notification={notification}
            remove={removeNotification}
          />
        ))}
      </ol>
    </div>
  );
}
