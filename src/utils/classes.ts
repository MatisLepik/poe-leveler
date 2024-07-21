import { AscendancyName, ClassName } from '../types';
import ascendancies from '../data/ascendancies.json';

export const getClassName = (ascendancyName: AscendancyName): ClassName => {
  const className = ascendancies.find(
    ({ name }) => name === ascendancyName
  )?.className;

  if (!className)
    throw new Error(`Failed to map ${ascendancyName} to a class name`);

  return className as ClassName;
};
