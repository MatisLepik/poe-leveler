import styles from './QuestName.module.scss';
import * as Tooltip from '@radix-ui/react-tooltip';
import questsByName from '../../data/quests.json';
import { QuestNames } from '../../types';

type QuestNameProps = {
  questName: QuestNames;
};

export default function QuestName({ questName }: QuestNameProps) {
  const questInfo = questsByName[questName as QuestNames];

  if (!questInfo) return <span>{questName}</span>;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.questName}>
          {questName}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={styles.hoverOverlay}
            sideOffset={4}
            collisionPadding={12}
          >
            <span className={styles.infoBubble}>Act {questInfo.act}</span>
            <span>{questInfo.howto}</span>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
