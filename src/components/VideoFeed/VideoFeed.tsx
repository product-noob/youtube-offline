import { useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { VideoCard } from './VideoCard';
import type { VideoItem } from '../../types';

interface VideoFeedProps {
  videos: VideoItem[];
}

// Only 4 real DOM slots — prev, current, next, next+1
const SLOTS = [-1, 0, 1, 2] as const;
type Slot = (typeof SLOTS)[number];

export function VideoFeed({ videos }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const cardEls = useRef<Map<Slot, HTMLDivElement>>(new Map());
  const n = videos.length;

  // Map slot offset to actual video index (wraps around)
  const getVidIndex = useCallback(
    (rel: Slot) => ((currentIndex + rel) % n + n) % n,
    [currentIndex, n],
  );

  // Apply CSS transforms directly on DOM elements (no React re-render for smooth drag)
  const setTransforms = useCallback((extraPercent: number, animated: boolean) => {
    SLOTS.forEach((rel) => {
      const el = cardEls.current.get(rel);
      if (!el) return;
      el.style.transition = animated
        ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        : 'none';
      el.style.transform = `translateY(${rel * 100 + extraPercent}%)`;
    });
  }, []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (isAnimating.current || n === 0) return;
      isAnimating.current = true;

      // Animate all slots in direction
      setTransforms(direction * -100, true);

      setTimeout(() => {
        // Synchronously update React state + reset transforms in one paint frame
        flushSync(() => {
          setCurrentIndex((prev) => ((prev + direction) % n + n) % n);
        });
        setTransforms(0, false);
        isAnimating.current = false;
      }, 300);
    },
    [n, setTransforms],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating.current) return;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isAnimating.current) return;
      const dy = e.touches[0].clientY - touchStartY.current;
      // Dampen drag slightly for a natural feel
      setTransforms((dy / window.innerHeight) * 90, false);
    },
    [setTransforms],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isAnimating.current) return;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (dy < -50) {
        navigate(1);
      } else if (dy > 50) {
        navigate(-1);
      } else {
        // Snap back to current
        setTransforms(0, true);
        setTimeout(() => setTransforms(0, false), 320);
      }
    },
    [navigate, setTransforms],
  );

  // Mouse wheel support for desktop testing
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;
      if (e.deltaY > 0) navigate(1);
      else navigate(-1);
    },
    [navigate],
  );

  if (n === 0) {
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
    <div
      className="video-feed-virtual"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      {SLOTS.map((rel) => {
        const vi = getVidIndex(rel);
        const video = videos[vi];
        return (
          <div
            key={rel}
            ref={(el) => {
              if (el) {
                cardEls.current.set(rel, el);
                // Set initial position without transition
                el.style.transition = 'none';
                el.style.transform = `translateY(${rel * 100}%)`;
              } else {
                cardEls.current.delete(rel);
              }
            }}
            className="video-card-virtual"
          >
            <VideoCard
              src={`${base}videos/${encodeURIComponent(video.filename)}`}
              title={video.title}
              isActive={rel === 0}
              isNext={rel === 1}
              videoIndex={vi}
            />
          </div>
        );
      })}
    </div>
  );
}
