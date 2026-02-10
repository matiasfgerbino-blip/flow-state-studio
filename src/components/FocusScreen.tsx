import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Pause, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import type { SessionConfig, SessionGoals, SubGoal } from '@/lib/types';
import ParticleBackground from './ParticleBackground';

interface Props {
  config: SessionConfig;
  goals: SessionGoals;
  secondsLeft: number;
  isRunning: boolean;
  currentPomodoro: number;
  isBreak: boolean;
  totalFocusSeconds: number;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onVolumeChange: (v: number) => void;
  onToggleSubGoal: (id: string) => void;
  onEnd: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function formatTotalTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function FocusScreen({
  config, goals, secondsLeft, isRunning, currentPomodoro, isBreak,
  totalFocusSeconds, volume, onPlay, onPause, onReset, onSkip,
  onVolumeChange, onToggleSubGoal, onEnd,
}: Props) {
  const totalSeconds = isBreak ? config.breakMinutes * 60 : config.workMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 140;
  const strokeOffset = circumference * (1 - progress);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <ParticleBackground slow={isBreak} />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl px-4">
        {/* Status */}
        <div className="text-center space-y-1">
          <p className={`text-sm font-medium uppercase tracking-widest ${isBreak ? 'text-blue-400' : 'text-primary'}`}>
            {isBreak ? '☕ Descanso' : '🎯 Concentración'}
          </p>
          <p className="text-muted-foreground text-xs">
            Pomodoro {currentPomodoro} de {config.totalPomodoros}
          </p>
        </div>

        {/* Pomodoro progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: config.totalPomodoros }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < currentPomodoro - (isBreak ? 0 : 1)
                  ? 'bg-primary glow-amber'
                  : i === currentPomodoro - 1 && !isBreak
                    ? 'bg-primary/60 animate-pulse'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Circular timer */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 320 320">
            <circle cx="160" cy="160" r="140" fill="none" stroke="hsl(220 15% 12%)" strokeWidth="4" />
            <circle
              cx="160" cy="160" r="140" fill="none"
              stroke={isBreak ? 'hsl(210 60% 50%)' : 'hsl(32 95% 55%)'}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 8px ${isBreak ? 'hsl(210 60% 50% / 0.5)' : 'hsl(32 95% 55% / 0.5)'})` }}
            />
          </svg>
          <div className="text-center">
            <div className={`font-mono-timer text-6xl md:text-7xl font-bold tracking-wider ${isBreak ? '' : 'text-glow-amber'}`}>
              {formatTime(secondsLeft)}
            </div>
            <p className="text-muted-foreground text-xs mt-2">
              Tiempo total: {formatTotalTime(totalFocusSeconds)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button onClick={onReset} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={isRunning ? onPause : onPlay}
            size="lg"
            className={`w-16 h-16 rounded-full ${isBreak ? 'bg-blue-500 hover:bg-blue-600' : 'glow-amber'}`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          <Button onClick={onSkip} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-40">
          <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <Slider
            value={[volume]}
            onValueChange={([v]) => onVolumeChange(v)}
            min={0} max={1} step={0.05}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
          />
        </div>

        {/* Goals sidebar */}
        <div className="glass-card p-4 w-full max-w-sm space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Objetivo</p>
          <p className="text-sm font-medium leading-snug">{goals.mainGoal}</p>
          {goals.subGoals.length > 0 && (
            <ul className="space-y-2 pt-2 border-t border-border/30">
              {goals.subGoals.map(sg => (
                <li key={sg.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={sg.completed}
                    onCheckedChange={() => onToggleSubGoal(sg.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className={`text-sm ${sg.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {sg.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button onClick={onEnd} variant="ghost" size="sm" className="text-muted-foreground text-xs">
          Finalizar sesión
        </Button>
      </div>
    </div>
  );
}
