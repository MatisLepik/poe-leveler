import { PassiveAction } from '../../types';
import Checkbox from '../Checkbox';

import styles from './PassiveChecklist.module.scss';

type PassiveChecklistProps = {
  completedPassives: Record<string, boolean>;
  toggle: (id: string) => void;
  actions: PassiveAction[];
};

export default function PassiveChecklist({
  completedPassives,
  toggle,
  actions,
}: PassiveChecklistProps) {
  return (
    <ol className={styles.actions}>
      {actions.map((action) => (
        <li key={action.id} className={styles.action}>
          <Checkbox
            onChange={() => {
              toggle(action.id);
            }}
            checked={completedPassives[action.id] === true}
          >
            <span
              className={`${styles.label} ${
                completedPassives[action.id] === true ? styles.done : ''
              } ${styles[action.type]}`}
            >
              {action.name}
            </span>
          </Checkbox>
        </li>
      ))}
    </ol>
  );
}
