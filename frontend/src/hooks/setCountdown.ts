import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds: number, resetKey: number, onExpire: () => void): number {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    setRemaining(seconds);
    if (seconds <= 0) return;

    const endAt = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        onExpireRef.current();
      }
    }, 250);

    return () => clearInterval(id);
  }, [seconds, resetKey]);

  return remaining;
}