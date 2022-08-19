import { FC, InputHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Header.module.scss';
import ContentWrapper from '../ContentWrapper';

type HeaderProps = Omit<InputHTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode;
};

const Header: FC<HeaderProps> = ({ className, title, children, ...props }) => {
  return (
    <header className={cn(styles.root, className)} {...props}>
      <ContentWrapper className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </ContentWrapper>
    </header>
  );
};

export default Header;
