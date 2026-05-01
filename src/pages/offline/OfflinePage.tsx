import { useState } from "react";
import styles from "./OfflinePage.module.css";

interface OfflinePageProps {
  onRetry: () => void;
}

export default function OfflinePage({ onRetry }: OfflinePageProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    onRetry();
    // Show spinner for at least 1.5s so the user sees feedback
    setTimeout(() => setRetrying(false), 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>

        <h1 className={styles.title}>Site Currently Offline</h1>

        <p className={styles.message}>
          We're currently performing scheduled maintenance. The site will be back
          online shortly. Thank you for your patience!
        </p>

        <button
          className={styles.retryButton}
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <span className={styles.spinner} />
              Checking...
            </>
          ) : (
            "Try Again"
          )}
        </button>
      </div>
    </div>
  );
}

