"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft | null {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(target)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center">
        <span className="font-serif text-lg text-charcoal/50 italic">
          Ended
        </span>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-charcoal text-cream rounded-lg flex items-center justify-center font-mono text-2xl font-bold shadow-md">
              {String(unit.value).padStart(2, "0")}
            </div>
            <span className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-charcoal/50 font-medium">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-charcoal/30 text-xl font-light mb-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
