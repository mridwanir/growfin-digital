'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  expiredLabel?: string;
}

export function CountdownTimer({
  targetDate,
  className = '',
  expiredLabel = 'Promo Berakhir'
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const targetTime = new Date(targetDate).getTime();
      if (isNaN(targetTime)) {
        setTimeLeft(targetDate);
        return;
      }

      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft(expiredLabel);
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');

      if (days > 0) {
        setTimeLeft(`${days}h ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      } else {
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, expiredLabel]);

  if (!targetDate) return null;

  return (
    <span className={`${className} ${isExpired ? 'opacity-75' : ''}`} suppressHydrationWarning>
      {timeLeft || '00:00:00'}
    </span>
  );
}
