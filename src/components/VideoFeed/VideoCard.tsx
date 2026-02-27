import { useRef, useState, useCallback, useEffect } from 'react';

interface VideoCardProps {
  src: string;
  title: string;
  isActive: boolean;
  videoIndex: number;
}

const LIKE_COUNTS = ['1.2K', '4.5K', '892', '23K', '5.6K', '12K', '340', '78K', '2.3K', '9.1K'];
const COMMENT_COUNTS = ['234', '1.2K', '89', '3.4K', '567', '2.1K', '45', '890', '123', '1.5K'];
const AVATAR_COLORS = ['#FF0000', '#00BCD4', '#FF5722', '#4CAF50', '#9C27B0', '#2196F3', '#FF9800', '#E91E63'];

function getChannel(title: string): string {
  const words = title.split(' ');
  return words.slice(0, Math.min(2, words.length)).join(' ');
}

export function VideoCard({ src, title, isActive, videoIndex }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const channel = getChannel(title);
  const likeCount = LIKE_COUNTS[videoIndex % LIKE_COUNTS.length];
  const commentCount = COMMENT_COUNTS[videoIndex % COMMENT_COUNTS.length];
  const avatarColor = AVATAR_COLORS[videoIndex % AVATAR_COLORS.length];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;
    const onTime = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [isActive]);

  const handleTap = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.action-buttons, .video-info, .shorts-header')) return;
      const video = videoRef.current;
      if (!video || !isActive) return;
      if (video.paused) {
        video.play().catch(() => {});
        setPaused(false);
      } else {
        video.pause();
        setPaused(true);
      }
    },
    [isActive],
  );

  return (
    <div className="video-card-inner" onClick={handleTap}>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        webkit-playsinline=""
        preload={isActive ? 'auto' : 'metadata'}
        disablePictureInPicture
      />

      {/* Top gradient */}
      <div className="top-gradient" />

      {/* Shorts header */}
      <div className="shorts-header">
        <div className="shorts-logo">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#FF0000"
              d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"
            />
          </svg>
          <span>Shorts</span>
        </div>
        <div className="header-actions">
          <button type="button" className="header-btn">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
          <button type="button" className="header-btn">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="pause-overlay">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#fff" opacity="0.8">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Right side action buttons */}
      <div className="action-buttons">
        <button
          type="button"
          className={`action-btn${liked ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            setDisliked(false);
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <button
          type="button"
          className={`action-btn${disliked ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setDisliked(!disliked);
            setLiked(false);
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
          </svg>
          <span>Dislike</span>
        </button>

        <button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
          </svg>
          <span>{commentCount}</span>
        </button>

        <button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M14 9V3l8 9-8 9v-6.2c-5 0-8.5 1.6-11 5 1-5 4-10 11-10.8z" />
          </svg>
          <span>Share</span>
        </button>

        <div className="sound-disc">
          <div className={`disc-inner${isActive && !paused ? ' spinning' : ''}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="bottom-gradient" />

      {/* Bottom video info */}
      <div className="video-info">
        <div className="channel-row">
          <div className="channel-avatar" style={{ background: avatarColor }}>
            <span>{channel[0]}</span>
          </div>
          <span className="channel-name">@{channel.toLowerCase().replace(/\s+/g, '')}</span>
          <button type="button" className="subscribe-btn" onClick={(e) => e.stopPropagation()}>
            Subscribe
          </button>
        </div>
        <div className="video-title">{title}</div>
        <div className="sound-row">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <span className="sound-label">Original sound &middot; {channel}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
