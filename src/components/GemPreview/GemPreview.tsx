import cn from 'classnames';

import { Gem } from '../../types';

import styles from './GemPreview.module.scss';

type SkillPreviewProps = {
  gem: Gem;
  variant?: 'regular' | 'minimal';
  className?: string;
  isDisabled?: boolean;
};

export default function GemPreview({
  gem,
  variant = 'regular',
  isDisabled,
  className,
}: SkillPreviewProps) {
  return (
    <div
      className={cn(
        styles.root,
        className,
        styles[gem.isSupport ? 'support' : 'active'],
        styles[variant],
        { [styles.disabled]: isDisabled }
      )}
    >
      <div className={`${styles.dot} ${styles[`color-${gem.color}`]}`} />
      <div className={styles.content}>
        <div className={styles.title}>
          {gem.name}{' '}
          {gem.maxLevel && variant === 'regular' ? (
            <span className={styles.maxLevel}>{gem.maxLevel}</span>
          ) : null}
        </div>
        {variant === 'regular' && gem.notes ? (
          <div className={styles.extra}>{gem.notes}</div>
        ) : null}
      </div>
    </div>
  );
}
