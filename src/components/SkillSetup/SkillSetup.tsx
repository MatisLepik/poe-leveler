import { SkillSetup as SkillSetupType } from '../../types';

import styles from './SkillSetup.module.scss';
import GemPreview from '../GemPreview';

type SkillSetupProps = {
  skillSetup: SkillSetupType;
  className?: string;
};

export default function SkillSetup({ skillSetup, className }: SkillSetupProps) {
  return (
    <div className={`${styles.root} ${className || ''}`}>
      {skillSetup.links.map((gem, index) => (
        <GemPreview gem={gem} key={index} />
      ))}
    </div>
  );
}
