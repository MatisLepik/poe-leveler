import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../types';
import { playLevelUp } from '../utils/soundEffects';

const useNotifications = (): [
  notifications: Notification[],
  addNotification: (
    title: Notification['title'],
    content: Notification['content'],
    logo: Notification['logo']
  ) => void,
  removeNotification: (id: string) => void,
  clearNotifications: () => void,
  isNotificationDrawerOpen: boolean,
  setNotificationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const addNotification = useCallback(
    (
      title: Notification['title'],
      content: Notification['content'],
      logo: Notification['logo']
    ) => {
      const id = uuidv4();
      setNotifications((prev) => [
        {
          id,
          title,
          content,
          logo,
          createdAt: new Date(),
        },
        ...prev,
      ]);

      setNotificationDrawerOpen(true);
      playLevelUp();
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const output = [...prev];
      const index = output.findIndex((x) => x.id === id);
      if (index !== -1) {
        output.splice(index, 1);
      }
      return output;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return [
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
  ];
};

export default useNotifications;
