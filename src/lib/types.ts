export type FrequencyType = 'alpha' | 'beta' | 'theta' | 'delta' | 'gamma';

export interface FrequencyInfo {
  id: FrequencyType;
  name: string;
  hz: number;
  baseFreq: number;
  description: string;
  icon: string;
  color: string;
}

export interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface SessionConfig {
  frequency: FrequencyType;
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  totalPomodoros: number;
  volume: number;
}

export interface SessionGoals {
  mainGoal: string;
  subGoals: SubGoal[];
}

export type AppScreen = 'setup' | 'goals' | 'focus' | 'break' | 'summary';

export interface SessionResult {
  completedPomodoros: number;
  totalPomodoros: number;
  totalFocusSeconds: number;
  completedSubGoals: number;
  totalSubGoals: number;
  mainGoal: string;
}

export const FREQUENCIES: FrequencyInfo[] = [
  { id: 'delta', name: 'Delta', hz: 2, baseFreq: 200, description: 'Sueño profundo y relajación total', icon: '🌙', color: 'from-indigo-500/20 to-purple-500/20' },
  { id: 'theta', name: 'Theta', hz: 6, baseFreq: 200, description: 'Meditación profunda y creatividad', icon: '🧘', color: 'from-violet-500/20 to-blue-500/20' },
  { id: 'alpha', name: 'Alpha', hz: 10, baseFreq: 200, description: 'Relajación activa y concentración suave', icon: '🌿', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'beta', name: 'Beta', hz: 20, baseFreq: 200, description: 'Concentración intensa y enfoque', icon: '⚡', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'gamma', name: 'Gamma', hz: 40, baseFreq: 200, description: 'Máximo rendimiento cognitivo', icon: '🚀', color: 'from-rose-500/20 to-red-500/20' },
];

export const DEFAULT_CONFIG: SessionConfig = {
  frequency: 'beta',
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  totalPomodoros: 4,
  volume: 0.3,
};
