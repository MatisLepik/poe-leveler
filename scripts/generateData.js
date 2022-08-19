import fs from 'fs';
import path from 'path';

/**
 * Gems
 */

const generateGems = () => {
  // Data for gems comes from https://github.com/brather1ng/RePoE/blob/master/RePoE/data/gems.json
  const getColor = (gem) => {
    const highestLevel = Object.keys(gem.per_level).sort((a, b) => b - a)?.[0];
    const statRequirements = gem.per_level[highestLevel]?.stat_requirements;

    if (
      !statRequirements ||
      Object.values(statRequirements).every((req) => req === 0)
    ) {
      return 'W';
    }

    const highestReq = [
      { color: 'B', req: gem.per_level[highestLevel].stat_requirements.int },
      { color: 'R', req: gem.per_level[highestLevel].stat_requirements.str },
      {
        color: 'G',
        req: gem.per_level[highestLevel].stat_requirements.dex,
      },
    ]
      .filter((x) => x.req)
      .sort((a, b) => b.req - a.req)[0];

    if (!highestReq) {
      throw new Error('Failed to parse gem color');
    }

    return highestReq.color;
  };

  // These don't come from gems, but I don't know how to filter them out automatically
  // They don't have any stat requirements, but some gems like portal and detonate mines also don't
  const ignoredGems = [
    'Gluttony of Elements',
    'Blood Offering',
    'Blinding Aura',
    'Death Aura',
  ];

  const formatGems = (json) => {
    const gems = Object.entries(json)
      .filter(([name]) => !name.endsWith('Royale'))
      .map(([name, gem]) => gem)
      .filter(
        (gem) =>
          gem.base_item &&
          gem.per_level?.['1'] &&
          gem.base_item.release_state === 'released' &&
          !ignoredGems.includes(gem.base_item.display_name)
      )
      .map((gem) => {
        return {
          name: gem.base_item.display_name,
          reqLvl: gem.per_level['1'].required_level,
          color: getColor(gem),
          isSupport: gem.is_support,
          minimumStatRequirements: gem.per_level['1'].stat_requirements,
        };
      });

    return gems.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), []);
  };

  const source = fs.readFileSync(
    path.resolve('src/data/source/gems.json'),
    'utf-8'
  );

  fs.writeFileSync(
    path.resolve('src/data/generated/gems.json'),
    JSON.stringify(formatGems(JSON.parse(source)), null, 2)
  );
};
generateGems();
