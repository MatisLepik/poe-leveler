import { FC } from 'react';
import { Build, BuildJSON } from '../../types';
import AscendancyThumbnail from '../AscendancyThumbnail';

import styles from './BuildOverview.module.scss';

type BuildOverviewProps = {
  build: BuildJSON | Build;
  addedAt?: string;
};

const formatter = Intl.DateTimeFormat('default', {
  year: '2-digit',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const BuildOverview: FC<BuildOverviewProps> = ({ build, addedAt }) => {
  return (
    <span className={styles.root}>
      <AscendancyThumbnail
        ascendancy={build.ascendancy}
        className={styles.ascendancyImage}
      />
      <span className={styles.textContent}>
        <span className={styles.nameRow}>
          <strong>{build.name}</strong> <small>({build.ascendancy})</small>
        </span>
        {addedAt && (
          <span className={styles.timeRow}>
            Added{' '}
            <time aria-label="Added at" dateTime={addedAt}>
              {formatter.format(new Date(addedAt))}
            </time>
          </span>
        )}
      </span>
    </span>
  );
};

export default BuildOverview;
