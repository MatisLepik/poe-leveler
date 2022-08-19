export type Ascendancy = {
  name:
    | 'Ascendant'
    | 'Juggernaut'
    | 'Berserker'
    | 'Chieftain'
    | 'Raider'
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
  className: string;
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

export enum PassiveActionType {
  allocate = 'allocate',
  unallocate = 'unallocate',
}

export type GemJSON = {
  name: string;
  id: string;
  notes?: string | undefined;
  maxLevel?: number;
};

export type Gem = GemJSON & {
  name: string;
  reqLvl: number;
  color: GemColor;
  isSupport: boolean;
  minimumStatRequirements: {
    [Stat.str]?: number;
    [Stat.dex]?: number;
    [Stat.int]?: number;
  };
};

export type SkillSetup = {
  id: string;
  from: number;
  to: number;
  links: Gem[];
};

export type ItemSetup = {
  id: string;
  from: number;
  to: number;
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
  ascendancy: Ascendancy['name'];
  skillSetups: SkillSetup[];
  itemSetups: ItemSetup[];
  tasks: Task[];
};

export type SkillSetupJSON = {
  id: string;
  from: number;
  to: number;
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
