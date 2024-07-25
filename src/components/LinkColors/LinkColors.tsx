import { orderBy } from 'lodash';
import { Build } from '../../types';
import SkillDot from '../SkillDot';
import styles from './LinkColors.module.scss';

type NextUpgradesProps = {
  build: Build;
};

export default function LinkColors({ build }: NextUpgradesProps) {
  return (
    <div>
      <p className={styles.description}>
        These are all the linked setups you will need throughout your
        progression. <br />
        It&apos;s recommended to set up a loot filter that highlights them.
      </p>
      <ul className={styles.list}>
        {orderBy(
          build.skillSetups.filter((setup) => setup.links.length >= 2),
          (setup) => setup.links.length
        ).map((setup) => (
          <li key={setup.id}>
            <div className={styles.dots}>
              {setup.links.map((gem) => (
                <SkillDot key={gem.id} gem={gem} title={gem.name} />
              ))}
            </div>
            {` (${setup.links
              .filter((gem) => !gem.isSupport)
              .map((gem) => gem.name)
              .join(' + ')})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
