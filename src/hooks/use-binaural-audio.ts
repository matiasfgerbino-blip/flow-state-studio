import { useRef, useCallback, useState } from 'react';
import { FREQUENCIES, type FrequencyType } from '@/lib/types';

export function useBinauralAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback((frequencyType: FrequencyType, volume: number) => {
    const freq = FREQUENCIES.find(f => f.id === frequencyType)!;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = volume * 0.15;
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq.baseFreq;
    osc1.connect(gain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq.baseFreq + freq.hz;
    osc2.connect(gain);

    osc1.start();
    osc2.start();

    ctxRef.current = ctx;
    gainRef.current = gain;
    osc1Ref.current = osc1;
    osc2Ref.current = osc2;
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    osc1Ref.current?.stop();
    osc2Ref.current?.stop();
    ctxRef.current?.close();
    ctxRef.current = null;
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((v: number) => {
    if (gainRef.current) gainRef.current.gain.value = v * 0.15;
  }, []);

  return { start, stop, setVolume, isPlaying };
}
