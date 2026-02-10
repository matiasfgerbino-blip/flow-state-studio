import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Target } from 'lucide-react';
import type { SessionGoals, SubGoal } from '@/lib/types';

interface Props {
  onStart: (goals: SessionGoals) => void;
  onBack: () => void;
}

export default function GoalsScreen({ onStart, onBack }: Props) {
  const [mainGoal, setMainGoal] = useState('');
  const [subGoals, setSubGoals] = useState<SubGoal[]>([]);
  const [newSub, setNewSub] = useState('');

  const addSub = () => {
    if (!newSub.trim()) return;
    setSubGoals(prev => [...prev, { id: crypto.randomUUID(), text: newSub.trim(), completed: false }]);
    setNewSub('');
  };

  const removeSub = (id: string) => setSubGoals(prev => prev.filter(s => s.id !== id));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">¿Qué vas a lograr hoy?</h2>
          <p className="text-muted-foreground text-sm">Define tu objetivo para mantener el enfoque durante la sesión.</p>
        </header>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Objetivo Principal</label>
          <Textarea
            value={mainGoal}
            onChange={e => setMainGoal(e.target.value)}
            placeholder="Ej: Terminar el diseño del landing page..."
            className="bg-card/60 border-border/50 min-h-[80px] text-base"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sub-objetivos</label>
          <div className="flex gap-2">
            <Input
              value={newSub}
              onChange={e => setNewSub(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSub()}
              placeholder="Agregar sub-objetivo..."
              className="bg-card/60 border-border/50"
            />
            <Button onClick={addSub} size="icon" variant="outline" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {subGoals.length > 0 && (
            <ul className="space-y-2">
              {subGoals.map(s => (
                <li key={s.id} className="glass-card px-4 py-2 flex items-center justify-between text-sm">
                  <span>{s.text}</span>
                  <button onClick={() => removeSub(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">← Volver</Button>
          <Button
            onClick={() => onStart({ mainGoal, subGoals })}
            disabled={!mainGoal.trim()}
            className="flex-1 glow-amber font-semibold"
          >
            Iniciar Concentración 🎯
          </Button>
        </div>
      </div>
    </div>
  );
}
