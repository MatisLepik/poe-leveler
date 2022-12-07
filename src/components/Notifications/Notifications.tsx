import cn from 'classnames';

import type { Notification as NotificationType } from '../../types';
import Notification from '../Notification';

import styles from './Notifications.module.scss';
import ChevronLeft from '../icons/ChevronLeft';
import NotificationAction from './NotificationAction';
import Clear from '../icons/Clear';

type NotificationsProps = {
  notifications: NotificationType[];
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  isOpen: boolean;
  toggle: () => void;
};

export default function Notifications({
  notifications,
  removeNotification,
  clearNotifications,
  isOpen,
  toggle,
}: NotificationsProps) {
  if (notifications.length === 0) return null;

  return (
    <div className={cn(styles.root, { [styles.isOpen]: isOpen })}>
      <div className={styles.actions}>
        <NotificationAction
          label="Toggle drawer"
          className={styles.toggler}
          onClick={toggle}
        >
          <ChevronLeft className={styles.togglerIcon} />
        </NotificationAction>
        <NotificationAction
          label="Clear notifications"
          onClick={clearNotifications}
        >
          <Clear />
        </NotificationAction>
      </div>
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
