import { v4 as uuidv4 } from 'uuid';
import {
  Build,
  Gem,
  GemJSON,
  ItemSetup,
  SkillSetup,
  SkillSetupJSON,
  Task,
} from './types';
import gems from './data/generated/gems.json';
import sortBy from 'lodash/sortBy';

const invalidCodeError = 'Invalid build code';

const assertIsBuild = (build: Record<string, unknown>): build is Build => {
  // Not bothering to check this deeply
  return (
    typeof build.id === 'string' &&
    typeof build.name === 'string' &&
    typeof build.ascendancy === 'string' &&
    Array.isArray(build.skillSetups) &&
    Array.isArray(build.itemSetups)
  );
};

const isObject = (input: unknown): input is Record<string, unknown> =>
  typeof input === 'object' && input != null;

const isValidSkillName = (name: string): name is keyof typeof gems => {
  return name in gems === true;
};

/**
 * This function has a bunch of naive casting, but I don't wanna go too crazy validating the JSON
 */
export const getBuild = (input: unknown): Build => {
  if (!isObject(input)) {
    throw new Error(invalidCodeError);
  }

  if (!Array.isArray(input.skillSetups)) {
    throw new Error(invalidCodeError);
  }

  try {
    const build = {
      ...input,
      skillSetups: input.skillSetups.map((skillSetup: unknown): SkillSetup => {
        if (!isObject(skillSetup)) {
          throw new Error(
            'Invalid gem configuration (skill setup not configured)'
          );
        }

        if (!Array.isArray(skillSetup.links)) {
          throw new Error('Invalid gem configuration (links is not an array)');
        }

        return {
          ...(skillSetup as SkillSetup),
          links: sortBy(
            skillSetup.links.map(({ name, ...gemData }) => {
              if (!isValidSkillName(name)) {
                throw new Error(
                  `Invalid gem configuration (${name} is not a valid name)`
                );
              }
              return {
                ...gemData,
                ...(gems[name] as Gem),
              };
            }),
            (link) => ['R', 'G', 'B', 'W'].indexOf(link.color)
          ),
        };
      }),
    };

    if (assertIsBuild(build)) {
      return build;
    }
  } catch (err) {
    console.error(err);
    throw new Error(invalidCodeError);
  }

  throw new Error(invalidCodeError);
};

export const makeGem = (): GemJSON => ({
  name: '',
  id: uuidv4(),
});

export const makeSkillSetup = (): SkillSetupJSON => ({
  from: 0,
  to: null,
  links: [makeGem()],
  id: uuidv4(),
});

export const makeItemSetup = (): ItemSetup => ({
  from: 1,
  to: null,
  name: '',
  id: uuidv4(),
});

export const makeTask = (): Task => ({
  from: 1,
  message: '',
  id: uuidv4(),
});
