import { FC } from 'react';
import GemPreview from '../../GemPreview';
import ItemSetup from '../../ItemSetup';
import SkillSetup from '../../SkillSetup';
import { Breakpoint, Upgrade, UpgradeType } from '../NextUpgrades';

import styles from './LevelBreakpoint.module.scss';

type LevelBreakpointProps = {
  breakpoint: Breakpoint;
};

const renderUpgrade = (upgrade: Upgrade) => {
  switch (upgrade.type) {
    case UpgradeType.Gem:
      return (
        <>
          <h3 className={styles.upgradeTitle}>New support</h3>
          <GemPreview gem={upgrade.gem} />
        </>
      );
    case UpgradeType.Skill:
      return (
        <>
          <h3 className={styles.upgradeTitle}>New skill setup</h3>
          <SkillSetup level={upgrade.level} skillSetup={upgrade.setup} />
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

const LevelBreakpoint: FC<LevelBreakpointProps> = ({ breakpoint }) => {
  return (
    <li className={styles.root}>
      <div className={styles.breakpointLevel}>{breakpoint.level}</div>
      <div className={styles.upgrades}>
        {breakpoint.upgrades.map((upgrade, index) => (
          <div key={index}>{renderUpgrade(upgrade)}</div>
        ))}
      </div>
    </li>
  );
};

export default LevelBreakpoint;
