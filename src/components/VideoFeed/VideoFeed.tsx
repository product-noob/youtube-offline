import { useRef, useState, useEffect, useMemo } from 'react';
import { VideoCard } from './VideoCard';
import type { VideoItem } from '../../types';

interface VideoFeedProps {
  videos: VideoItem[];
}

export function VideoFeed({ videos }: VideoFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Repeat videos for endless scroll feel
  const repeatedVideos = useMemo(() => {
    if (videos.length === 0) return [];
    const count = Math.max(1, Math.ceil(80 / videos.length));
    return Array(count).fill(videos).flat();
  }, [videos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) setActiveIndex(index);
          }
        }
      },
      { root: container, threshold: 0.5 },
    );

    const cards = container.querySelectorAll('[data-index]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [repeatedVideos.length]);

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path
            fill="#aaa"
            d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"
          />
        </svg>
        <p>No videos found</p>
        <p className="empty-hint">
          Add MP4 files to the <code>public/videos</code> folder
        </p>
      </div>
    );
  }

  const base = import.meta.env.BASE_URL;

  return (
    <div className="video-feed" ref={containerRef}>
      {repeatedVideos.map((video, index) => (
        <div key={index} className="video-card" data-index={index}>
          <VideoCard
            src={`${base}videos/${encodeURIComponent(video.filename)}`}
            title={video.title}
            isActive={index === activeIndex}
            videoIndex={index}
          />
        </div>
      ))}
    </div>
  );
}
