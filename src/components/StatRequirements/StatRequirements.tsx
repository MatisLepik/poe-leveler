import { SkillSetup } from '../../types';
import { getRequirements } from './StatRequirements.util';

import styles from './StatRequirements.module.scss';

type StatRequirementsProps = {
  skillSetups: SkillSetup[];
};

export default function StatRequirements({
  skillSetups,
}: StatRequirementsProps) {
  const currentRequirements = getRequirements(skillSetups);

  return (
    <ul className={styles.list}>
      {currentRequirements.map((req) => (
        <li key={req.stat} className={`${styles.stat} ${styles[req.stat]}`}>
          {req.value} {req.stat}
        </li>
      ))}
    </ul>
  );
}
