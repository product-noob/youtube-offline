import { useState, useEffect } from 'react';
import type { VideoItem } from '../types';

export function useVideoList() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'videos.json')
      .then((res) => res.json())
      .then((data: VideoItem[]) => setVideos(data))
      .catch(() => setVideos([]))
      .finally(() => setLoaded(true));
  }, []);

  return { videos, loaded };
}
