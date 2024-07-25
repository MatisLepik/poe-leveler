import cn from 'classnames';

import { Build, Gem } from '../../types';

import styles from './GemPreview.module.scss';
import { getClassName } from '../../utils/classes';
import QuestName from '../QuestName';
import SkillDot from '../SkillDot';

type SkillPreviewProps = {
  gem: Gem;
  variant?: 'regular' | 'minimal';
  className?: string;
  isDisabled?: boolean;
} & (
  | {
      variant?: 'regular';
      build: Build;
    }
  | {
      variant: 'minimal';
      build?: never;
    }
);

export default function GemPreview({
  gem,
  build,
  variant = 'regular',
  isDisabled,
  className,
}: SkillPreviewProps) {
  const renderAcquisition = () => {
    if (variant !== 'regular' || !build) return null;

    const acquisition = gem.acquisitionByClass[getClassName(build.ascendancy)];

    if (acquisition.questName) {
      return (
        <div className={styles.extra}>
          <QuestName questName={acquisition.questName} />
          &nbsp;
          <span>
            ({acquisition.npc},{acquisition.isReward ? ' reward' : ' buy'})
          </span>
        </div>
      );
    }

    return <div className={styles.extra}>{acquisition.npc}</div>;
  };

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
      <SkillDot gem={gem} />
      <div className={styles.content}>
        <div className={styles.title}>{gem.name}</div>
        {renderAcquisition()}
        {variant === 'regular' && gem.notes ? (
          <div className={styles.extra}>{gem.notes}</div>
        ) : null}
      </div>
    </div>
  );
}
