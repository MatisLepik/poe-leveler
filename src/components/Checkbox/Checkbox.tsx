import styles from './Checkbox.module.scss';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({
  className,
  children,
  ...props
}: CheckboxProps) {
  return (
    <label className={styles.wrapper}>
      <input
        {...props}
        className={`${styles.input} ${className || ''}`}
        type="checkbox"
      />
      <div className={styles.statusDisplay}>
        <div className={styles.check} />
      </div>
      {children && <div className={styles.label}>{children}</div>}
    </label>
  );
}
