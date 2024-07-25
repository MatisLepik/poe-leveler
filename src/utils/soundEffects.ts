import levelUpMp3 from '../assets/level-up.mp3';

export function playLevelUp() {
  const audio = new Audio(levelUpMp3);
  audio.volume = 0.5;
  audio.play();
}
