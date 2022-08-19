import { ItemSetup as ItemSetupType } from '../../types';

import styles from './ItemSetup.module.scss';

type ItemSetupProps = {
  itemSetup: ItemSetupType;
  className?: string;
};

export default function ItemSetup({ itemSetup, className }: ItemSetupProps) {
  return (
    <div className={`${styles.itemSetup} ${className || ''}`}>
      <div className={styles.title}>{itemSetup.name}</div>
      <div className={styles.extra}>{itemSetup.notes}</div>
    </div>
  );
}
