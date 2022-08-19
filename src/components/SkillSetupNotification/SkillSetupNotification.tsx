import { SkillSetup } from '../../types';
import GemPreview from '../GemPreview';

import styles from './SkillSetupNotification.module.scss';

type SkillSetupNotificationProps = {
  addedSetups: SkillSetup[];
  removedSetups: SkillSetup[];
};

const pluralizeText = (count: number, singular: string, plural: string) =>
  count > 1 ? plural : singular;

const SetupsOverview = ({
  title,
  setups,
}: {
  title: string;
  setups: SkillSetup[];
}) => {
  if (setups.length === 0) return null;

  return (
    <div
      className={`${styles.overview} ${
        setups.length === 1 ? styles.isSingle : ''
      }`}
    >
      <div className={styles.title}>{title}</div>
      <ul className={styles.setups}>
        {setups.map((setup) => (
          <li key={setup.id} className={styles.setup}>
            {setup.links
              .filter((gem) => !gem.isSupport)
              .map((gem) => (
                <GemPreview key={gem.name} gem={gem} variant="minimal" />
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function SkillSetupNotification({
  addedSetups,
  removedSetups,
}: SkillSetupNotificationProps) {
  if (addedSetups.length > 2 || removedSetups.length > 2)
    return (
      <span>Quite a few setups changed. Take a look at the current gems!</span>
    );

  return (
    <>
      <SetupsOverview
        title={`${addedSetups.length} ${pluralizeText(
          addedSetups.length,
          'setup was',
          'setups were'
        )} added:`}
        setups={addedSetups}
      />
      <SetupsOverview
        title={`${removedSetups.length} ${pluralizeText(
          removedSetups.length,
          'setup was',
          'setups were'
        )} removed:`}
        setups={removedSetups}
      />
    </>
  );
}
