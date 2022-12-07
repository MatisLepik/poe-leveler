import { FC, HTMLAttributes } from 'react';
import useEventListener from '@use-it/event-listener';

import Button from '../Button';

import styles from './Modal.module.scss';

type ModalProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  dismiss: () => void;
};

const Modal: FC<ModalProps> = ({ title, dismiss, children, ...props }) => {
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') dismiss();
  });

  return (
    <div className={styles.root} {...props}>
      <div className={styles.backdrop} onClick={dismiss} />
      <div className={styles.content}>
        <header>
          <h2 className={styles.title}>{title}</h2>
          <Button
            className={styles.closeButton}
            variant="secondary"
            size="small"
            onClick={() => dismiss()}
          >
            &times;
          </Button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
