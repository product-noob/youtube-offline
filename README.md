# KidsVids PWA

A distraction-free, ad-free video player for young children. Parents download YouTube videos as MP4 files, drop them into a folder, and the child gets a TikTok-style swipe-through experience with only those curated videos -- no algorithms, no ads, no rabbit holes.

Built as a Progressive Web App so it can be installed on any phone or tablet and launched like a native app.

## How It Works

1. The parent downloads videos (nursery rhymes, learning songs, etc.) as MP4 files
2. The files go into `public/videos/`
3. Each video is listed in `public/videos.json` with a filename and title
4. The app is built and deployed to GitHub Pages
5. The child opens the app, taps "Start", and swipes through the videos

### User Flow

- **Tap to Start** -- A full-screen gate appears on launch. The child (or parent) taps to begin. This also unlocks audio playback on iOS, which requires a user-initiated gesture before any sound can play.
- **Swipe Up/Down** -- Videos are stacked vertically in a full-screen feed. Native CSS `scroll-snap` handles the swipe gesture -- swipe up for next video, swipe down for previous.
- **Tap to Play/Pause** -- Tapping anywhere on the video toggles playback. A brief play/pause icon fades in and out as feedback.
- **Auto-Loop and Auto-Advance** -- Each video loops 3 times, then the feed automatically scrolls to the next video. When the last video finishes, it wraps back to the first.

## Adding Videos

1. Download a video as MP4 (using [yt-dlp](https://github.com/yt-dlp/yt-dlp), a browser extension, or any other method)
2. Rename the file to use only lowercase letters, numbers, and hyphens (e.g., `abc-phonics-song.mp4`). Avoid spaces, `#`, and other special characters.
3. Place the file in `public/videos/`
4. Add an entry to `public/videos.json`:

```json
[
  {
    "filename": "one-two-three-learn-numbers.mp4",
    "title": "One Two Three - Learn Numbers"
  },
  {
    "filename": "abc-phonics-song.mp4",
    "title": "ABC Phonics Song"
  }
]
```

5. Rebuild and redeploy (`git push` triggers the GitHub Actions workflow)

## Tech Stack

- **React 19 + TypeScript** -- UI layer
- **Vite 7** -- Build tool with hot module replacement
- **vite-plugin-pwa** -- Generates the service worker, web manifest, and handles PWA registration
- **CSS scroll-snap** -- Native swipe navigation between full-screen video cards
- **HTML5 `<video>`** -- Direct MP4 playback with no third-party player library
- **GitHub Pages** -- Hosting, deployed via GitHub Actions on push to `main`

No runtime dependencies beyond React. No router, no state library, no video player library.

## Project Structure

```
src/
  App.tsx                          Root component: GestureGate -> VideoFeed
  main.tsx                         Entry point, mounts React
  components/
    GestureGate.tsx                "Tap to Start" overlay, unlocks iOS audio
    VideoFeed/
      VideoFeed.tsx                Scroll-snap container, IntersectionObserver
      VideoCard.tsx                Full-screen <video>, tap play/pause, loop logic
  hooks/
    useVideoList.ts                Fetches videos.json on mount
    useLoopCounter.ts              Counts plays per video, signals advance after 3
  types/
    index.ts                       VideoItem interface
  utils/
    constants.ts                   DEFAULT_LOOP_COUNT
  styles/
    global.css                     Reset, scroll-snap, video card, gesture gate
public/
  videos/                          Drop MP4 files here
  videos.json                      Video manifest (filename + title)
```

## How It's Implemented

### Video Feed (`VideoFeed.tsx`)

The feed is a `div` with `overflow-y: scroll` and `scroll-snap-type: y mandatory`. Each video card is `100dvh` tall with `scroll-snap-align: start`. This gives native, hardware-accelerated swipe-to-snap behavior on both iOS and Android.

An `IntersectionObserver` (threshold 0.5) watches all cards. When a card becomes more than 50% visible, it becomes the "active" card. The active card's video auto-plays; all others pause.

`touch-action: pan-y` is set on the card and video elements to ensure vertical swipe gestures are always recognized by the browser, even when touching the `<video>` element directly.

### Video Card (`VideoCard.tsx`)

Each card wraps a native `<video>` element with `playsInline` (required for inline playback on iOS). The active video uses `preload="auto"` for immediate playback; inactive videos use `preload="metadata"` to avoid buffering all videos at once.

Tap-to-play/pause is handled by a click listener on the card wrapper. A translucent play/pause icon animates in and fades out over 800ms.

### Loop Counter (`useLoopCounter.ts`)

Tracks how many times the current video has reached its `ended` event. After 3 plays (configurable via `DEFAULT_LOOP_COUNT`), it signals `'advance'` instead of `'replay'`, and the feed scrolls to the next card.

### Gesture Gate (`GestureGate.tsx`)

iOS and Safari block audio playback until a user-initiated gesture occurs. The gate shows on first load. When tapped, it creates a temporary `AudioContext`, plays a silent buffer within the synchronous gesture chain, and then dismisses itself. All subsequent programmatic `video.play()` calls work with sound.

### PWA Configuration (`vite.config.ts`)

The app is configured as a standalone, portrait-oriented PWA with a black theme. `vite-plugin-pwa` generates a service worker that precaches the app shell (JS, CSS, HTML, icons). Video files are included as static assets but not precached by the service worker (they're served directly from the CDN/server).

The GitHub Actions workflow builds the app, copies `index.html` to `404.html` (for SPA routing on GitHub Pages), and deploys to the `github-pages` environment.

## Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173/Youtube-PWA/`. The `/Youtube-PWA/` base path matches the GitHub Pages deployment URL.

## Build and Deploy

```bash
npm run build
```

The production build goes to `dist/`. Pushing to `main` automatically triggers the GitHub Actions deployment workflow.
