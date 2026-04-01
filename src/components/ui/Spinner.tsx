import styles from "./Spinner.module.css";

interface SpinnerProps {
  text?: string;
}

export function Spinner({ text }: SpinnerProps) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
