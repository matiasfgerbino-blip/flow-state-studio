import { useState, useCallback } from 'react';
import { DEFAULT_CONFIG, type SessionConfig, type SessionGoals, type AppScreen, type SessionResult } from '@/lib/types';
import { usePomodoro } from '@/hooks/use-pomodoro';
import { useBinauralAudio } from '@/hooks/use-binaural-audio';
import SetupScreen from '@/components/SetupScreen';
import GoalsScreen from '@/components/GoalsScreen';
import FocusScreen from '@/components/FocusScreen';
import SummaryScreen from '@/components/SummaryScreen';
import ParticleBackground from '@/components/ParticleBackground';

// Load saved config from localStorage
function loadConfig(): SessionConfig {
  try {
    const saved = localStorage.getItem('focushz-config');
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_CONFIG;
}

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [config, setConfig] = useState<SessionConfig>(loadConfig);
  const [goals, setGoals] = useState<SessionGoals>({ mainGoal: '', subGoals: [] });
  const [volume, setVolume] = useState(config.volume);
  const [result, setResult] = useState<SessionResult | null>(null);

  const audio = useBinauralAudio();

  const onPhaseEnd = useCallback((wasBreak: boolean) => {
    // Play a small notification beep
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = wasBreak ? 880 : 440;
      gain.gain.value = 0.1;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close(), 500);
    } catch {}
  }, []);

  const pomodoro = usePomodoro(config, onPhaseEnd);

  const handleConfigChange = (c: SessionConfig) => {
    setConfig(c);
    localStorage.setItem('focushz-config', JSON.stringify(c));
  };

  const handleStartSession = (g: SessionGoals) => {
    setGoals(g);
    setScreen('focus');
    pomodoro.reset();
    pomodoro.play();
    audio.start(config.frequency, volume);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audio.setVolume(v);
  };

  const handleToggleSubGoal = (id: string) => {
    setGoals(prev => ({
      ...prev,
      subGoals: prev.subGoals.map(sg => sg.id === id ? { ...sg, completed: !sg.completed } : sg),
    }));
  };

  const handleEndSession = () => {
    pomodoro.pause();
    audio.stop();
    setResult({
      completedPomodoros: pomodoro.currentPomodoro - (pomodoro.isBreak ? 0 : 1),
      totalPomodoros: config.totalPomodoros,
      totalFocusSeconds: pomodoro.totalFocusSeconds,
      completedSubGoals: goals.subGoals.filter(s => s.completed).length,
      totalSubGoals: goals.subGoals.length,
      mainGoal: goals.mainGoal,
    });
    setScreen('summary');
  };

  const handleNewSession = () => {
    pomodoro.reset();
    setGoals({ mainGoal: '', subGoals: [] });
    setResult(null);
    setScreen('setup');
  };

  // Check if session is complete
  if (screen === 'focus' && pomodoro.isComplete) {
    handleEndSession();
  }

  return (
    <>
      {screen === 'setup' && (
        <>
          <ParticleBackground />
          <SetupScreen config={config} onChange={handleConfigChange} onNext={() => setScreen('goals')} />
        </>
      )}
      {screen === 'goals' && (
        <>
          <ParticleBackground />
          <GoalsScreen onStart={handleStartSession} onBack={() => setScreen('setup')} />
        </>
      )}
      {screen === 'focus' && (
        <FocusScreen
          config={config}
          goals={goals}
          secondsLeft={pomodoro.secondsLeft}
          isRunning={pomodoro.isRunning}
          currentPomodoro={pomodoro.currentPomodoro}
          isBreak={pomodoro.isBreak}
          totalFocusSeconds={pomodoro.totalFocusSeconds}
          volume={volume}
          onPlay={pomodoro.play}
          onPause={pomodoro.pause}
          onReset={pomodoro.reset}
          onSkip={pomodoro.skip}
          onVolumeChange={handleVolumeChange}
          onToggleSubGoal={handleToggleSubGoal}
          onEnd={handleEndSession}
        />
      )}
      {screen === 'summary' && result && (
        <>
          <ParticleBackground />
          <SummaryScreen result={result} onNewSession={handleNewSession} />
        </>
      )}
    </>
  );
}
