import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../types';

const useNotifications = (): [
  notifications: Notification[],
  addNotification: (
    title: Notification['title'],
    content: Notification['content'],
    logo: Notification['logo']
  ) => void,
  removeNotification: (id: string) => void,
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

  return [
    notifications,
    addNotification,
    removeNotification,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
  ];
};

export default useNotifications;
