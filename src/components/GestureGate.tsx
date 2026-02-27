import { useCallback } from 'react';

interface GestureGateProps {
  onUnlock: () => void;
}

export function GestureGate({ onUnlock }: GestureGateProps) {
  const handleTap = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      ctx.resume().then(() => {
        setTimeout(() => ctx.close(), 100);
      }).catch(() => {});
    } catch {
      // AudioContext not available
    }
    onUnlock();
  }, [onUnlock]);

  return (
    <div className="gesture-gate" onClick={handleTap}>
      <svg className="gate-icon" viewBox="0 0 24 24" width="72" height="72">
        <path
          fill="#FF0000"
          d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"
        />
      </svg>
      <h1 className="gate-title">Shorts</h1>
      <p className="gate-subtitle">Tap anywhere to start watching</p>
    </div>
  );
}
