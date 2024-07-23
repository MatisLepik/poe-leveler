import { FC, ReactNode } from 'react';
import { Build, BuildJSON } from '../../types';
import AscendancyThumbnail from '../AscendancyThumbnail';

import styles from './BuildOverview.module.scss';

type BuildOverviewProps = {
  build: BuildJSON | Build;
  description?: ReactNode;
};

const BuildOverview: FC<BuildOverviewProps> = ({ build, description }) => {
  return (
    <span className={styles.root}>
      <AscendancyThumbnail
        ascendancy={build.ascendancy}
        className={styles.ascendancyImage}
        width="87px"
        height="40px"
      />
      <span className={styles.textContent}>
        <span className={styles.name}>
          <strong>{build.name}</strong> <small>({build.ascendancy})</small>
        </span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>
    </span>
  );
};

export default BuildOverview;
