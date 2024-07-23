import orderBy from 'lodash/orderBy';

import { Build, Gem, ItemSetup, SkillSetup } from '../../types';
import { getSkillSetups } from '../../utils/setups';

export enum UpgradeType {
  Skill,
  Item,
  Gem,
}

type UpgradeBase = {
  type: unknown;
  level: number;
};

export type SkillUpgrade = UpgradeBase & {
  type: UpgradeType.Skill;
  setup: SkillSetup;
};

export type GemUpgrade = UpgradeBase & {
  type: UpgradeType.Gem;
  gem: Gem;
  setup: SkillSetup;
};

export type ItemUpgrade = UpgradeBase & {
  type: UpgradeType.Item;
  setup: ItemSetup;
};

export type Upgrade = SkillUpgrade | GemUpgrade | ItemUpgrade;

export type Breakpoint = {
  level: number;
  upgrades: Upgrade[];
};
const getSupportUpgrades = (build: Build, currentLevel: number): GemUpgrade[] =>
  getSkillSetups(build, currentLevel).reduce<GemUpgrade[]>(
    (upgrades, setup) => {
      const setupLevel = setup.from;

      const newUpgrades = [
        ...setup.links
          .filter((gem) => {
            return (
              gem.reqLvl !== setupLevel &&
              gem.reqLvl > currentLevel &&
              (setup.to === null || gem.reqLvl <= setup.to)
            );
          })
          .map<GemUpgrade>((gem) => {
            return {
              type: UpgradeType.Gem,
              level: gem.reqLvl,
              gem,
              setup,
            };
          }),
      ];

      return [...upgrades, ...newUpgrades];
    },
    []
  );

const getSetupUpgrades = (
  build: Build,
  currentLevel: number
): (SkillUpgrade | ItemUpgrade)[] => {
  const unachievedSetups = [...build.itemSetups, ...build.skillSetups].filter(
    (setup) => setup.from !== null && setup.from > currentLevel
  );

  return unachievedSetups.map((setup) =>
    'links' in setup
      ? {
          type: UpgradeType.Skill,
          level: setup.from as number,
          setup,
        }
      : {
          type: UpgradeType.Item,
          level: setup.from as number,
          setup,
        }
  );
};

export const getBreakpoints = (
  build: Build,
  currentLevel: number
): Breakpoint[] => {
  const breakpointsByLevel: Record<string, Breakpoint> = {};

  const allUpgrades: Upgrade[] = [
    ...getSetupUpgrades(build, currentLevel),
    ...getSupportUpgrades(build, currentLevel),
  ];

  allUpgrades.forEach((upgrade) => {
    if (breakpointsByLevel[upgrade.level] == null) {
      breakpointsByLevel[upgrade.level] = {
        level: upgrade.level,
        upgrades: [],
      };
    }
    breakpointsByLevel[upgrade.level].upgrades.push(upgrade);
  });

  const breakpoints = Object.values(breakpointsByLevel);

  return orderBy(breakpoints, ['level'], ['asc']);
};
