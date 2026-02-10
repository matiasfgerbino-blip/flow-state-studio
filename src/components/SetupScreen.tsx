import { FREQUENCIES, type SessionConfig, type FrequencyType } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  config: SessionConfig;
  onChange: (c: SessionConfig) => void;
  onNext: () => void;
}

export default function SetupScreen({ config, onChange, onNext }: Props) {
  const set = (partial: Partial<SessionConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Focus<span className="text-primary">Hz</span>
          </h1>
          <p className="text-muted-foreground text-lg">Sintoniza tu mente. Alcanza el flujo.</p>
        </header>

        {/* Frequency selector */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Frecuencia Binaural</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {FREQUENCIES.map(f => (
              <button
                key={f.id}
                onClick={() => set({ frequency: f.id })}
                className={cn(
                  'glass-card p-3 text-center transition-all duration-300 cursor-pointer',
                  config.frequency === f.id
                    ? 'ring-2 ring-primary glow-amber scale-[1.02]'
                    : 'hover:border-primary/30'
                )}
              >
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="font-semibold text-sm">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.hz}Hz</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {FREQUENCIES.find(f => f.id === config.frequency)?.description}
          </p>
        </section>

        {/* Timer config */}
        <section className="glass-card p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trabajo</span>
              <span className="font-mono-timer text-primary font-semibold">{config.workMinutes} min</span>
            </div>
            <Slider
              value={[config.workMinutes]}
              onValueChange={([v]) => set({ workMinutes: v })}
              min={5} max={90} step={5}
              className="[&_[role=slider]]:bg-primary"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Descanso</span>
              <span className="font-mono-timer text-primary font-semibold">{config.breakMinutes} min</span>
            </div>
            <Slider
              value={[config.breakMinutes]}
              onValueChange={([v]) => set({ breakMinutes: v })}
              min={1} max={30} step={1}
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pomodoros</span>
              <span className="font-mono-timer text-primary font-semibold">{config.totalPomodoros}</span>
            </div>
            <Slider
              value={[config.totalPomodoros]}
              onValueChange={([v]) => set({ totalPomodoros: v })}
              min={1} max={12} step={1}
            />
          </div>
        </section>

        <Button onClick={onNext} size="lg" className="w-full text-lg h-14 glow-amber font-semibold">
          Definir Objetivo →
        </Button>
      </div>
    </div>
  );
}
