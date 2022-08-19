import { FC, useRef, useState } from 'react';
import Button from '../Button';

type CopyButtonProps = {
  className?: string;
  getText: () => string;
};

const CopyButton: FC<CopyButtonProps> = ({ getText, className }) => {
  const [recentFeedback, setRecentFeedback] = useState<string | null>(null);
  const timeoutRef = useRef<number>();

  const handleCopyFinish = (message: string) => {
    setRecentFeedback(message);

    window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setRecentFeedback(null);
    }, 2000);
  };

  const copy = () => {
    navigator.clipboard.writeText(getText()).then(
      () => {
        handleCopyFinish('Copied');
      },
      (err) => {
        console.error(err);
        handleCopyFinish('Failed to copy');
      }
    );
  };

  return (
    <Button
      variant="secondary"
      className={className}
      onClick={copy}
      style={{ minWidth: 83 }}
    >
      {recentFeedback ?? 'Copy'}
    </Button>
  );
};

export default CopyButton;
