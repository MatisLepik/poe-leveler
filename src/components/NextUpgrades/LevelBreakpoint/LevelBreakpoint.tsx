import { FC } from 'react';
import GemPreview from '../../GemPreview';
import ItemSetup from '../../ItemSetup';
import SkillSetup from '../../SkillSetup';
import { Breakpoint, Upgrade, UpgradeType } from '../NextUpgrades.utils';
import { Build } from '../../../types';

import styles from './LevelBreakpoint.module.scss';

type LevelBreakpointProps = {
  build: Build;
  breakpoint: Breakpoint;
};

const renderUpgrade = (build: Build, upgrade: Upgrade) => {
  switch (upgrade.type) {
    case UpgradeType.Gem:
      return (
        <>
          <h3 className={styles.upgradeTitle}>
            New support for{' '}
            {upgrade.setup.links.find((link) => !link.isSupport)?.name ||
              'unknown active setup'}
          </h3>
          <GemPreview gem={upgrade.gem} build={build} />
        </>
      );
    case UpgradeType.Skill:
      return (
        <>
          <h3 className={styles.upgradeTitle}>New skill setup</h3>
          <SkillSetup
            level={upgrade.level}
            skillSetup={upgrade.setup}
            build={build}
          />
        </>
      );
    case UpgradeType.Item:
      return (
        <>
          <h3 className={styles.upgradeTitle}>New item</h3>
          <ItemSetup itemSetup={upgrade.setup} />
        </>
      );
  }
};

const LevelBreakpoint: FC<LevelBreakpointProps> = ({ build, breakpoint }) => {
  return (
    <li className={styles.root}>
      <div className={styles.breakpointLevel}>{breakpoint.level}</div>
      <div className={styles.upgrades}>
        {breakpoint.upgrades.map((upgrade, index) => (
          <div key={index}>{renderUpgrade(build, upgrade)}</div>
        ))}
      </div>
    </li>
  );
};

export default LevelBreakpoint;
