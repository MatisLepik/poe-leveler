import orderBy from 'lodash/orderBy';
import { Build } from '../types';

export const getSkillSetups = (build: Build, level: number) => {
  return orderBy(
    build.skillSetups.filter(
      (setup) => level >= setup.from && level <= setup.to
    ),
    [(setup) => setup.from],
    ['asc']
  );
};

export const getItemSetups = (build: Build, level: number) => {
  return orderBy(
    build.itemSetups.filter(
      (setup) => level >= setup.from && level <= setup.to
    ),
    [(setup) => setup.from, 'desc']
  );
};
