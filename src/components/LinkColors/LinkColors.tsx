import { orderBy } from 'lodash';
import { Build } from '../../types';
import SkillDot from '../SkillDot';
import styles from './LinkColors.module.scss';

type NextUpgradesProps = {
  build: Build;
};

export default function LinkColors({ build }: NextUpgradesProps) {
  return (
    <div className={styles.linkColors}>
      <p className={styles.description}>
        These are the linked setups you&apos;ll need during your progression.
        <br />
        It&apos;s recommended to set up a loot filter that highlights them.
      </p>
      <ul className={styles.setups}>
        {orderBy(
          build.skillSetups.filter((setup) => setup.links.length >= 2),
          (setup) => setup.links.length
        ).map((setup) => (
          <li key={setup.id} className={styles.setup}>
            <span className={styles.setupName}>
              {setup.links
                .filter((gem) => !gem.isSupport)
                .map((gem) => gem.name)
                .join(' + ')}
            </span>
            <div className={styles.dots}>
              {setup.links.map((gem) => (
                <SkillDot key={gem.id} gem={gem} title={gem.name} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
