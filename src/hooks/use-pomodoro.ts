import { useState, useRef, useCallback, useEffect } from 'react';
import type { SessionConfig } from '@/lib/types';

interface PomodoroState {
  secondsLeft: number;
  isRunning: boolean;
  currentPomodoro: number;
  isBreak: boolean;
  totalFocusSeconds: number;
}

export function usePomodoro(config: SessionConfig, onPhaseEnd: (isBreak: boolean) => void) {
  const [state, setState] = useState<PomodoroState>({
    secondsLeft: config.workMinutes * 60,
    isRunning: false,
    currentPomodoro: 1,
    isBreak: false,
    totalFocusSeconds: 0,
  });
  const intervalRef = useRef<number | null>(null);
  const onPhaseEndRef = useRef(onPhaseEnd);
  onPhaseEndRef.current = onPhaseEnd;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.secondsLeft <= 1) {
        // Phase ended
        const wasBreak = prev.isBreak;
        setTimeout(() => onPhaseEndRef.current(wasBreak), 0);

        if (wasBreak) {
          const nextPomodoro = prev.currentPomodoro + 1;
          if (nextPomodoro > config.totalPomodoros) {
            return { ...prev, secondsLeft: 0, isRunning: false };
          }
          return {
            ...prev,
            secondsLeft: config.workMinutes * 60,
            currentPomodoro: nextPomodoro,
            isBreak: false,
          };
        } else {
          const isLongBreak = prev.currentPomodoro % 4 === 0;
          const breakTime = isLongBreak ? config.longBreakMinutes : config.breakMinutes;
          return {
            ...prev,
            secondsLeft: breakTime * 60,
            isBreak: true,
          };
        }
      }
      return {
        ...prev,
        secondsLeft: prev.secondsLeft - 1,
        totalFocusSeconds: prev.isBreak ? prev.totalFocusSeconds : prev.totalFocusSeconds + 1,
      };
    });
  }, [config]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.isRunning, tick, clearTimer]);

  const play = useCallback(() => setState(p => ({ ...p, isRunning: true })), []);
  const pause = useCallback(() => setState(p => ({ ...p, isRunning: false })), []);
  const reset = useCallback(() => {
    clearTimer();
    setState({
      secondsLeft: config.workMinutes * 60,
      isRunning: false,
      currentPomodoro: 1,
      isBreak: false,
      totalFocusSeconds: 0,
    });
  }, [config, clearTimer]);

  const skip = useCallback(() => {
    setState(prev => {
      if (prev.isBreak) {
        const next = prev.currentPomodoro + 1;
        if (next > config.totalPomodoros) {
          return { ...prev, secondsLeft: 0, isRunning: false };
        }
        return { ...prev, secondsLeft: config.workMinutes * 60, currentPomodoro: next, isBreak: false };
      }
      const isLong = prev.currentPomodoro % 4 === 0;
      return { ...prev, secondsLeft: (isLong ? config.longBreakMinutes : config.breakMinutes) * 60, isBreak: true };
    });
  }, [config]);

  const isComplete = state.secondsLeft === 0 && !state.isRunning && state.currentPomodoro >= config.totalPomodoros && state.isBreak;

  return { ...state, play, pause, reset, skip, isComplete };
}
