import { HTMLAttributes } from 'react';
import { Gem } from '../../types';
import styles from './SkillDot.module.scss';

type SkillDotProps = HTMLAttributes<HTMLDivElement> & {
  gem: Gem;
};

export default function SkillDot({ gem, ...rest }: SkillDotProps) {
  return (
    <div
      {...rest}
      className={`${styles.dot} ${styles[`color-${gem.color}`]}`}
    />
  );
}
