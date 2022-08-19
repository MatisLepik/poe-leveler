import { FC, HTMLAttributes } from 'react';
import Ascendant from '../../images/ascendancies/Ascendant.png';
import Assassin from '../../images/ascendancies/Assassin.png';
import Berserker from '../../images/ascendancies/Berserker.png';
import Champion from '../../images/ascendancies/Champion.png';
import Chieftain from '../../images/ascendancies/Chieftain.png';
import Deadeye from '../../images/ascendancies/Deadeye.png';
import Elementalist from '../../images/ascendancies/Elementalist.png';
import Gladiator from '../../images/ascendancies/Gladiator.png';
import Guardian from '../../images/ascendancies/Guardian.png';
import Hierophant from '../../images/ascendancies/Hierophant.png';
import Inquisitor from '../../images/ascendancies/Inquisitor.png';
import Juggernaut from '../../images/ascendancies/Juggernaut.png';
import Necromancer from '../../images/ascendancies/Necromancer.png';
import Occultist from '../../images/ascendancies/Occultist.png';
import Pathfinder from '../../images/ascendancies/Pathfinder.png';
import Raider from '../../images/ascendancies/Raider.png';
import Saboteur from '../../images/ascendancies/Saboteur.png';
import Slayer from '../../images/ascendancies/Slayer.png';
import Trickster from '../../images/ascendancies/Trickster.png';

import styles from './AscendancyThumbnail.module.scss';
import { Ascendancy } from '../../types';

const thumbnails: Record<Ascendancy['name'], string> = {
  Ascendant,
  Assassin,
  Berserker,
  Champion,
  Chieftain,
  Deadeye,
  Elementalist,
  Gladiator,
  Guardian,
  Hierophant,
  Inquisitor,
  Juggernaut,
  Necromancer,
  Occultist,
  Pathfinder,
  Raider,
  Saboteur,
  Slayer,
  Trickster,
};

type AscendancyThumbnailProps = HTMLAttributes<HTMLImageElement> & {
  ascendancy: Ascendancy['name'];
};

const AscendancyThumbnail: FC<AscendancyThumbnailProps> = ({
  ascendancy,
  ...props
}) => {
  return (
    <img
      src={thumbnails[ascendancy]}
      alt={ascendancy}
      className={styles.ascendancyImage}
      {...props}
    />
  );
};

export default AscendancyThumbnail;
