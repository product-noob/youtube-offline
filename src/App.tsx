import { useState } from 'react';
import { GestureGate } from './components/GestureGate';
import { VideoFeed } from './components/VideoFeed/VideoFeed';
import { BottomNav } from './components/BottomNav';
import { useVideoList } from './hooks/useVideoList';

export default function App() {
  const [gateOpen, setGateOpen] = useState(true);
  const { videos, loaded } = useVideoList();

  if (gateOpen) {
    return <GestureGate onUnlock={() => setGateOpen(false)} />;
  }

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <VideoFeed videos={videos} />
      <BottomNav />
    </>
  );
}
