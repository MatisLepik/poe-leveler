import { SkillSetup, Stat } from '../../types';

export const getRequirements = (
  skillSetups: SkillSetup[]
): { stat: Stat; value: number }[] => {
  const byStat: Record<Stat, number> = {
    [Stat.dex]: 0,
    [Stat.str]: 0,
    [Stat.int]: 0,
  };

  skillSetups.forEach((setup) => {
    setup.links.forEach((gem) => {
      Object.values(Stat).forEach((stat) => {
        const value = gem.minimumStatRequirements[stat];
        if (value !== undefined) {
          byStat[stat] = Math.max(byStat[stat], value);
        }
      });
    });
  });

  return Object.values(Stat)
    .map((stat) => ({ stat, value: byStat[stat] }))
    .filter((x) => x.value !== 0);
};
