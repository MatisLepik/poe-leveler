import fs from 'fs';
import path from 'path';
import allClasses from '../src/data/classes.json' assert { type: 'json' };

/**
 * Gems data is pulled from https://poegems.com/json
 */

// Adapts poegems type to internal one. TODO: Refactor so they're consistent
const colorMap = {
  White: 'W',
  Red: 'R',
  Blue: 'B',
  Green: 'G',
};

const titleCase = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');

const decodeQuest = (string) =>
  titleCase(string.replace(/_/g, ' ').replace(/ s /, "'s ")); // the siren's cadence

const getAcquisition = (quests, className) => {
  // Turn classes from a comma separated string to an array.
  // Also, if there's "All", replaces it with explicit array of all classes to simplify subsequent logic
  const parsedQuests = quests.map((quest) => {
    const classes = quest.classes.split(', ');
    return {
      ...quest,
      classes: classes.includes('All') ? [...allClasses] : classes,
    };
  });

  const questWithNpc = parsedQuests.find((quest) => {
    return quest.classes.includes(className) && quest.npc;
  });

  if (!questWithNpc) {
    return {
      npc: 'Lilly Roth',
      questName: null,
      isReward: false,
    };
  }

  return {
    npc: questWithNpc.npc,
    questName: decodeQuest(questWithNpc.name),
    isReward: parsedQuests.some(
      (quest) => quest.classes.includes(className) && !quest.npc
    ),
  };
};

const getAcquisitionByClass = (quests) => {
  return allClasses.reduce(
    (output, className) => ({
      ...output,
      [className]: getAcquisition(quests, className),
    }),
    {}
  );
};

const getColor = (gem) => {
  const color = colorMap[gem.colors[0]];

  if (!color) {
    throw new Error('Failed to parse gem color');
  }

  return color;
};

const formatGems = (unparsedGems) => {
  const gems = unparsedGems.map((gem) => {
    return {
      name: gem.name,
      reqLvl: Number(gem.level),
      color: getColor(gem),
      isSupport: gem.tags.includes('Support'),
      acquisitionByClass: getAcquisitionByClass(gem.quests),
      price: gem.price,
    };
  });

  return gems.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), []);
};

const generateGems = () => {
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
