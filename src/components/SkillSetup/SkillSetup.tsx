import { Build, SkillSetup as SkillSetupType } from '../../types';

import styles from './SkillSetup.module.scss';
import GemPreview from '../GemPreview';

type SkillSetupProps = {
  build: Build;
  skillSetup: SkillSetupType;
  className?: string;
  level: number;
};

export default function SkillSetup({
  build,
  skillSetup,
  className,
  level,
}: SkillSetupProps) {
  return (
    <div className={`${styles.root} ${className || ''}`}>
      {skillSetup.links.map((gem, index) => (
        <GemPreview
          gem={gem}
          key={index}
          isDisabled={level < gem.reqLvl}
          build={build}
        />
      ))}
    </div>
  );
}
