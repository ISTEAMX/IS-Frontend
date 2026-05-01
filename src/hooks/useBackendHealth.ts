import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const HEALTH_CHECK_INTERVAL = 30_000; // 30 seconds
const HEALTH_CHECK_TIMEOUT = 5_000;   // 5 seconds

const backendBase = import.meta.env.VITE_API_URL || "";
const HEALTH_URL = backendBase
  ? `${backendBase}/actuator/health`
  : "/actuator/health";

export function useBackendHealth() {
  const [isBackendUp, setIsBackendUp] = useState(true);
  const [checking, setChecking] = useState(true);
  const wasDown = useRef(false);

  const checkHealth = useCallback(async () => {
    try {
      await axios.get(HEALTH_URL, { timeout: HEALTH_CHECK_TIMEOUT });

      if (wasDown.current) {
        window.location.reload();
        return;
      }

      setIsBackendUp(true);
    } catch {
      wasDown.current = true;
      setIsBackendUp(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isBackendUp, checking, retry: checkHealth };
}




