import { useEffect } from 'react';
import { uniqBy } from 'lodash';
import GemPreview from '../../components/GemPreview';
import Celebration from '../../components/icons/Celebration';
import Sword from '../../components/icons/Sword';
import Task from '../../components/icons/Task';
import SkillSetupNotification from '../../components/SkillSetupNotification';
import useNotifications from '../../hooks/useNotifications';
import usePrevious from '../../hooks/usePrevious';
import { Build, ItemSetup, SkillSetup } from '../../types';

import styles from './Leveler.module.scss';

export function useBuildNotifications(
  level: number,
  build: Build,
  currentSkillSetups: SkillSetup[],
  currentItemSetups: ItemSetup[]
) {
  const notifications = useNotifications();

  const [, addNotification] = notifications;

  const previousLevel = usePrevious(level);

  useEffect(() => {
    if (
      previousLevel == null ||
      level <= previousLevel ||
      previousLevel === level
    ) {
      return;
    }

    const newSkillSetups = currentSkillSetups.filter(
      (setup) => setup.from === level
    );
    const newItemSetups = currentItemSetups.filter(
      (setup) => setup.from === level
    );

    const removedSkillSetups = build.skillSetups.filter(
      (setup) => setup.to === level - 1
    );

    const newSupportSkills = currentSkillSetups
      .filter((setup) => setup.from !== level)
      .flatMap((setup) => setup.links)
      .filter((gem) => gem.reqLvl === level);

    const newTasks = build.tasks.filter((task) => task.from === level);

    if (newSkillSetups.length > 0) {
      addNotification(
        `Skill setup changed`,
        <div className={styles.skillSetupNotificationContent}>
          <SkillSetupNotification
            addedSetups={newSkillSetups}
            removedSetups={removedSkillSetups}
          />
        </div>,
        Celebration
      );
    }

    if (newItemSetups.length > 0) {
      addNotification(
        `New ${newItemSetups.length > 1 ? 'items' : 'item'} unlocked`,
        newItemSetups.map((setup) => setup.name).join('; '),
        Sword
      );
    }

    if (newSupportSkills.length > 0) {
      const uniqueSupports = uniqBy(newSupportSkills, 'name');
      addNotification(
        `New ${
          uniqueSupports.length === 1 ? 'support' : 'supports'
        } equippable`,
        <div className={styles.skillSetupNotificationContent}>
          <ul className={styles.resetList}>
            {uniqueSupports.map((gem) => (
              <GemPreview key={gem.name} gem={gem} variant="minimal" />
            ))}
          </ul>
        </div>,
        Celebration
      );
    }

    newTasks.forEach((task) =>
      addNotification(`New task unlocked`, task.message, Task)
    );
  }, [
    level,
    previousLevel,
    addNotification,
    build,
    currentSkillSetups,
    currentItemSetups,
  ]);

  return notifications;
}
