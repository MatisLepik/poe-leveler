import { FC, useMemo } from 'react';

import { Build } from '../../types';
import LevelBreakpoint from './LevelBreakpoint';
import { getBreakpoints } from './NextUpgrades.utils';

import styles from './NextUpgrades.module.scss';

type NextUpgradesProps = {
  build: Build;
  level: number;
};

const NextUpgrades: FC<NextUpgradesProps> = ({ build, level }) => {
  const nextBreakpoints = useMemo(
    () => getBreakpoints(build, level),
    [build, level]
  );

  if (nextBreakpoints.length === 0) {
    return <div className={styles.finished}>All done!</div>;
  }

  return (
    <ol className={styles.root}>
      {nextBreakpoints.map((breakpoint) => (
        <LevelBreakpoint
          key={breakpoint.level}
          breakpoint={breakpoint}
          build={build}
        />
      ))}
    </ol>
  );
};

export default NextUpgrades;
