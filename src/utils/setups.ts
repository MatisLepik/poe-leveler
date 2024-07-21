import orderBy from 'lodash/orderBy';
import { Build, ItemSetup, SkillSetupJSON } from '../types';
import produce from 'immer';

export const getSkillSetups = (build: Build, level: number) => {
  return orderBy(
    build.skillSetups
      // Filter out setups where from/to is out of range
      .filter(
        (setup) =>
          (setup.from === null || level >= setup.from) &&
          (setup.to === null || level <= setup.to)
      )
      // Filter out setups that have nothing active available at current leve
      .filter((setup) =>
        setup.links.some((gem) => !gem.isSupport && gem.reqLvl <= level)
      ),

    [(setup) => setup.from],
    ['asc']
  );
};

export const getItemSetups = (build: Build, level: number) => {
  return orderBy(
    build.itemSetups.filter(
      (setup) =>
        (setup.from === null || level >= setup.from) &&
        (setup.to === null || level <= setup.to)
    ),
    [(setup) => setup.from, 'desc']
  );
};

export const changeLevelRequirement = <T extends SkillSetupJSON | ItemSetup>(
  setups: T[],
  changedSetup: T,
  type: 'from' | 'to',
  inputValue: string
): T[] | false => {
  const newLevelRequirement = inputValue === '' ? null : Number(inputValue);

  // Don't change if the value is invalid
  if (
    newLevelRequirement !== null &&
    (isNaN(newLevelRequirement) ||
      newLevelRequirement < 0 ||
      newLevelRequirement > 100)
  ) {
    return false;
  }

  return produce(setups, (draft) => {
    const matchingSetup = draft.find((setup) => setup.id === changedSetup.id);

    if (!matchingSetup) {
      console.error('Unexpected situation', draft, changedSetup);
      return;
    }

    matchingSetup[type] = newLevelRequirement;
  });
};
