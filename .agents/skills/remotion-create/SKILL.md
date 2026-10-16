---
name: remotion-create
description: >-
  Create a new Remotion video. Use when the user wants to create programmatic
  video using React and Remotion, animate data visualizations, build video
  templates, render video from code, or produce motion graphics with JavaScript.
  Activate when the user says "create a Remotion video", "make a video with
  Remotion", "animate with Remotion", or wants to build programmatic video content.
---

# Remotion Create Skill

This skill guides you through creating a new Remotion project from scratch,
building compositions, animating components, and rendering the final video.

---

## What is Remotion?

Remotion lets you create videos using React. You write React components that
render differently based on a `frame` prop (current frame number), and Remotion
renders each frame to produce a video file.

Key concepts:
- **Composition**: A React component registered as a video sequence
- **Frame**: The current frame number (0-indexed); drives all animations
- **FPS**: Frames per second (default: 30)
- **Duration**: Total frames = `durationInFrames`
- **`useCurrentFrame()`**: Hook that returns the current frame number
- **`interpolate()`**: Maps frame ranges to value ranges (like CSS animations)
- **`spring()`**: Physics-based spring animation

---

## Step 1: Create a New Project

```bash
npx create-video@latest
```

Follow prompts to select:
- **Blank** template (recommended for custom work)
- Or choose a starter template (Hello World, React Three Fiber, TailwindCSS)

Then install deps:
```bash
cd my-video
npm install
```

---

## Step 2: Project Structure

```
my-video/
├── src/
│   ├── Root.tsx          # Register all compositions here
│   ├── MyComposition.tsx # Your main video component
│   └── ...
├── public/               # Static assets (images, fonts, audio)
├── remotion.config.ts    # Remotion configuration
└── package.json
```

---

## Step 3: Define a Composition

In `src/Root.tsx`:

```tsx
import { Composition } from 'remotion';
import { MyComposition } from './MyComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyComposition}
        durationInFrames={150}   // 5 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Hello Remotion!',
        }}
      />
    </>
  );
};
```

---

## Step 4: Build the Video Component

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const MyComposition: React.FC<{ titleText: string }> = ({ titleText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Fade in over first 30 frames
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spring animation for scale
  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  // Slide up from below
  const translateY = interpolate(frame, [0, 30], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f0f23',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          color: 'white',
          fontSize: 72,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
        }}
      >
        {titleText}
      </h1>
    </div>
  );
};
```

---

## Step 5: Preview in Studio

```bash
npm start
```

Opens the Remotion Studio at `http://localhost:3000` for live preview and scrubbing.

---

## Step 6: Render the Video

```bash
# Render to MP4
npx remotion render MyVideo out/video.mp4

# Render with custom settings
npx remotion render MyVideo out/video.mp4 --codec=h264 --crf=18

# Render a still (single frame)
npx remotion still MyVideo out/thumbnail.png --frame=30

# Render a GIF
npx remotion render MyVideo out/animation.gif
```

---

## Core Animation APIs

### `interpolate(frame, inputRange, outputRange, options?)`
Maps a frame range to any numeric value range.

```tsx
// Opacity: 0→1 over frames 0→30
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

// Color value
const red = interpolate(frame, [0, 60], [0, 255]);
```

### `spring({ frame, fps, config?, from?, to?, delay? })`
Physics-based spring animation (always starts from 0, ends at 1 by default).

```tsx
const scale = spring({ frame, fps, config: { stiffness: 200, damping: 20 } });
```

### `useCurrentFrame()`
Returns the current frame number. Use in every animated component.

### `useVideoConfig()`
Returns `{ fps, durationInFrames, width, height, id }`.

---

## Sequencing with `<Sequence>`

```tsx
import { Sequence } from 'remotion';

export const MyScene: React.FC = () => (
  <>
    {/* Show Title from frame 0 for 60 frames */}
    <Sequence from={0} durationInFrames={60}>
      <Title />
    </Sequence>

    {/* Show Content from frame 40 for 90 frames (overlaps with title) */}
    <Sequence from={40} durationInFrames={90}>
      <Content />
    </Sequence>
  </>
);
```

---

## Using Assets

### Images
```tsx
import { staticFile, Img } from 'remotion';
<Img src={staticFile('logo.png')} />
```

### Audio
```tsx
import { staticFile, Audio } from 'remotion';
<Audio src={staticFile('music.mp3')} startFrom={0} volume={0.8} />
```

### Video
```tsx
import { staticFile, OffthreadVideo } from 'remotion';
<OffthreadVideo src={staticFile('clip.mp4')} />
```

---

## Common Video Sizes

| Format | Width | Height |
|--------|-------|--------|
| 1080p (Landscape) | 1920 | 1080 |
| 1080p (Portrait/Reels) | 1080 | 1920 |
| Square (Instagram) | 1080 | 1080 |
| 4K | 3840 | 2160 |
| Twitter/X | 1280 | 720 |

---

## Best Practices

- **Clamp interpolations** with `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` unless you want values to continue beyond the range
- **Use `spring()`** for natural-feeling UI animations; use `interpolate()` for precise timing control
- **Avoid expensive computations** inside render — memoize with `useMemo`
- **Keep compositions short** — split long videos into multiple compositions and concatenate
- **Use `delayRender()`** when loading async assets to prevent frame skipping
- **Test at multiple frame rates** before final render
- **Use `<Series>`** from `@remotion/player` for sequential scene composition
