import { useEffect, useMemo, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export type LevelTrackStatus = {
  status: 'error' | 'success' | 'warning';
  message: string;
};

export const useLevelUpTracker = (
  setLevel: React.Dispatch<React.SetStateAction<number>>
) => {
  const [charName, setCharName] = useLocalStorageState<string>('', {
    defaultValue: '',
  });

  const [internalLevelTrackStatus, setLevelTrackStatus] =
    useState<LevelTrackStatus>({
      status: 'error',
      message: 'Uninitialized',
    });

  const levelTrackStatus = useMemo<LevelTrackStatus>(() => {
    if (!charName) return { status: 'warning', message: 'Please enter a name' };
    return internalLevelTrackStatus;
  }, [charName, internalLevelTrackStatus]);

  useEffect(() => {
    const levelUpHandler = ((
      event: CustomEvent<{
        level: number;
        charName: string;
      }>
    ) => {
      const levelUp = event.detail;
      if (levelUp.charName === charName) {
        setLevel(levelUp.level);
      }
    }) as EventListener;
    window.addEventListener('level-up', levelUpHandler);

    return () => {
      window.removeEventListener('level-up', levelUpHandler);
    };
  }, [charName, setLevel]);

  useEffect(() => {
    const statusChangeHandler = ((event: CustomEvent<LevelTrackStatus>) => {
      setLevelTrackStatus(event.detail);
    }) as EventListener;
    window.addEventListener('level-track-status-change', statusChangeHandler);

    return () => {
      window.removeEventListener(
        'level-track-status-change',
        statusChangeHandler
      );
    };
  }, []);

  return { levelTrackStatus, charName, setCharName };
};
