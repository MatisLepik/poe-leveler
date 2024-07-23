import questsByName from './data/quests.json';

export type ClassName =
  | 'Scion'
  | 'Marauder'
  | 'Ranger'
  | 'Witch'
  | 'Duelist'
  | 'Templar'
  | 'Shadow';

export type AscendancyName =
  | 'Ascendant'
  | 'Juggernaut'
  | 'Berserker'
  | 'Chieftain'
  | 'Warden'
  | 'Deadeye'
  | 'Pathfinder'
  | 'Occultist'
  | 'Elementalist'
  | 'Necromancer'
  | 'Slayer'
  | 'Gladiator'
  | 'Champion'
  | 'Inquisitor'
  | 'Hierophant'
  | 'Guardian'
  | 'Assassin'
  | 'Trickster'
  | 'Saboteur';

export type Ascendancy = {
  name: AscendancyName;
  className: ClassName;
};

export enum GemColor {
  R = 'R',
  G = 'G',
  B = 'B',
  W = 'W',
}

export enum Stat {
  'str' = 'str',
  'dex' = 'dex',
  'int' = 'int',
}

export type QuestNames = keyof typeof questsByName;

export enum PassiveActionType {
  allocate = 'allocate',
  unallocate = 'unallocate',
}

export type GemJSON = {
  name: string;
  id: string;
  notes?: string | undefined;
};

export type GemAcquisition = {
  npc: string;
  questName: QuestNames | null;
  isReward: boolean;
};

export type Gem = GemJSON & {
  name: string;
  reqLvl: number;
  color: GemColor;
  isSupport: boolean;
  acquisitionByClass: Record<ClassName, GemAcquisition>;
};

export type LevelRequirement = number | null;

export type SkillSetup = {
  id: string;
  from: LevelRequirement;
  to: LevelRequirement;
  links: Gem[];
};

export type ItemSetup = {
  id: string;
  from: LevelRequirement;
  to: LevelRequirement;
  name: string;
  notes?: string | undefined;
};

export type PassiveAction = {
  id: string;
  type: PassiveActionType;
  name: string;
};

export type Task = {
  id: string;
  from: number;
  message: string;
};

export type Build = {
  id: string;
  name: string;
  ascendancy: AscendancyName;
  skillSetups: SkillSetup[];
  itemSetups: ItemSetup[];
  tasks: Task[];
  link: string | undefined;
};

export type SkillSetupJSON = {
  id: string;
  from: LevelRequirement;
  to: LevelRequirement;
  links: GemJSON[];
};

/**
 * This is the same as Build but without derived data, for sharing
 * It's used as an input for the application
 */
export type BuildJSON = Omit<Build, 'skillSetups'> & {
  skillSetups: SkillSetupJSON[];
};

export type Notification = {
  id: string;
  title: string;
  content: string | React.ReactNode;
  logo: React.ComponentType<{ className?: string }>;
  createdAt: Date;
};
