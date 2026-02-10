import { Button } from '@/components/ui/button';
import type { SessionResult } from '@/lib/types';
import { Trophy, Clock, CheckCircle2, Target } from 'lucide-react';

interface Props {
  result: SessionResult;
  onNewSession: () => void;
}

function formatTotalTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function SummaryScreen({ result, onNewSession }: Props) {
  const allDone = result.completedPomodoros === result.totalPomodoros;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md space-y-6 animate-fade-in text-center">
        <div className="text-6xl">{allDone ? '🏆' : '👏'}</div>
        <h2 className="text-3xl font-bold">
          {allDone ? '¡Sesión completada!' : '¡Buen trabajo!'}
        </h2>
        <p className="text-muted-foreground">{result.mainGoal}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 space-y-1">
            <Trophy className="w-5 h-5 text-primary mx-auto" />
            <div className="font-mono-timer text-2xl font-bold text-primary">
              {result.completedPomodoros}/{result.totalPomodoros}
            </div>
            <p className="text-xs text-muted-foreground">Pomodoros</p>
          </div>
          <div className="glass-card p-4 space-y-1">
            <Clock className="w-5 h-5 text-primary mx-auto" />
            <div className="font-mono-timer text-2xl font-bold text-primary">
              {formatTotalTime(result.totalFocusSeconds)}
            </div>
            <p className="text-xs text-muted-foreground">Enfoque total</p>
          </div>
          {result.totalSubGoals > 0 && (
            <div className="glass-card p-4 space-y-1 col-span-2">
              <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
              <div className="font-mono-timer text-2xl font-bold text-primary">
                {result.completedSubGoals}/{result.totalSubGoals}
              </div>
              <p className="text-xs text-muted-foreground">Sub-objetivos completados</p>
            </div>
          )}
        </div>

        <Button onClick={onNewSession} size="lg" className="w-full glow-amber font-semibold text-lg h-14">
          Nueva Sesión 🚀
        </Button>
      </div>
    </div>
  );
}
