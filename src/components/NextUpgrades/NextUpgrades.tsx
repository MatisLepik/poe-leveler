import { FC, useMemo } from 'react';
import orderBy from 'lodash/orderBy';

import { Build, Gem, ItemSetup, SkillSetup } from '../../types';
import { getSkillSetups } from '../../utils/setups';

import styles from './NextUpgrades.module.scss';
import LevelBreakpoint from './LevelBreakpoint';

type NextUpgradesProps = {
  build: Build;
  level: number;
};

export enum UpgradeType {
  Skill,
  Item,
  Gem,
}

export type Upgrade = {
  type: unknown;
  level: number;
} & (
  | {
      type: UpgradeType.Gem;
      gem: Gem;
    }
  | {
      type: UpgradeType.Item;
      setup: ItemSetup;
    }
  | {
      type: UpgradeType.Skill;
      setup: SkillSetup;
    }
);

export type Breakpoint = {
  level: number;
  upgrades: Upgrade[];
};

const getBreakpoints = (build: Build, level: number): Breakpoint[] => {
  const breakpointsByLevel: Record<string, Breakpoint> = {};
  const unachievedSetups = [...build.itemSetups, ...build.skillSetups].filter(
    (setup) => setup.from > level
  );
  const unachievedSupportUnlocks = getSkillSetups(build, level)
    .flatMap((setup) => setup.links)
    .filter((gem) => gem.reqLvl > level);

  unachievedSetups.forEach((setup) => {
    if (breakpointsByLevel[setup.from] == null) {
      breakpointsByLevel[setup.from] = {
        level: setup.from,
        upgrades: [],
      };
    }

    breakpointsByLevel[setup.from].upgrades.push(
      'links' in setup
        ? {
            type: UpgradeType.Skill,
            level: setup.from,
            setup,
          }
        : {
            type: UpgradeType.Item,
            level: setup.from,
            setup,
          }
    );
  });

  unachievedSupportUnlocks.forEach((gem) => {
    if (breakpointsByLevel[gem.reqLvl] == null) {
      breakpointsByLevel[gem.reqLvl] = {
        level: gem.reqLvl,
        upgrades: [],
      };
    }

    breakpointsByLevel[gem.reqLvl].upgrades.push({
      type: UpgradeType.Gem,
      level: gem.reqLvl,
      gem,
    });
  });

  const breakpoints = Object.values(breakpointsByLevel);

  return orderBy(breakpoints, ['level'], ['asc']);
};

const NextUpgrades: FC<NextUpgradesProps> = ({ build, level }) => {
  const nextBreakpoints = useMemo(
    () => getBreakpoints(build, level),
    [build, level]
  ).slice(0, 4);

  if (nextBreakpoints.length === 0) {
    return <div className={styles.finished}>All done!</div>;
  }

  return (
    <ol className={styles.root}>
      {nextBreakpoints.map((breakpoint) => (
        <LevelBreakpoint key={breakpoint.level} breakpoint={breakpoint} />
      ))}
    </ol>
  );
};

export default NextUpgrades;
