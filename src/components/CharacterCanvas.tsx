import React, { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from './AudioEngine.ts';

export interface TelemetryData {
  fps: number;
  currentAngleDeg: number;
  targetAngleDeg: number;
  activeFrame: number | 'CENTER';
  isDeadzone: boolean;
  distancePx: number;
  deadzoneRadiusPx: number;
  cursorX: number;
  cursorY: number;
  loadedCount: number;
  totalCount: number;
  isReady: boolean;
}

interface CharacterCanvasProps {
  onTelemetryUpdate?: (data: TelemetryData) => void;
  onFaceCenterChange?: (pos: { x: number; y: number }) => void;
}

const TOTAL_FRAMES = 64;
const BG_COLOR = '#060fef';
const LERP_FACTOR = 0.14; // Silky smooth organic head & eye tracking
const DEADZONE_RADIUS_FACTOR = 0.08; // Natural eye-contact deadzone radius

// Face center normalized coordinates within the 1920x1080 source frame
const FACE_NORM_X = 0.50;
const FACE_NORM_Y = 0.38;

/**
 * Shortest-path circular angular lerp
 * Smoothly interpolates angles across the -PI / +PI or 0 / 2*PI boundary
 */
function lerpAngle(current: number, target: number, factor: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * factor;
}

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({
  onTelemetryUpdate,
  onFaceCenterChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preloaded images state
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const centerFrameRef = useRef<HTMLImageElement | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Tracking physics state
  const mousePosRef = useRef({ x: window.innerWidth * 0.75, y: window.innerHeight * 0.4 });
  const smoothedAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const isDeadzoneRef = useRef<boolean>(false);
  const distanceRef = useRef<number>(0);
  const deadzoneRadiusRef = useRef<number>(100);
  const faceScreenPosRef = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 });

  // FPS measurement
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const currentFpsRef = useRef(60);

  // Track last interaction time for subtle ambient idle gaze
  const lastInteractionTimeRef = useRef<number>(performance.now());
  const lastTelemetrySendRef = useRef<number>(0);

  // Progressive frame loading: Center frame first, then cardinal keyframes, then stream remaining
  useEffect(() => {
    let loaded = 0;
    const totalToLoad = TOTAL_FRAMES + 1;
    framesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // 1. Load center neutral frame immediately for instant first paint
    const centerImg = new Image();
    centerImg.src = '/frames/center.webp';
    centerImg.onload = () => {
      centerFrameRef.current = centerImg;
      setIsReady(true);
      loaded += 1;
      setLoadProgress(Math.round((loaded / totalToLoad) * 100));
    };
    centerImg.onerror = () => {
      console.warn('Failed to load center.webp');
    };

    // 2. Load 8 cardinal directions first for rapid compass tracking (0, 8, 16, 24, 32, 40, 48, 56)
    const cardinalIndices = [0, 8, 16, 24, 32, 40, 48, 56];
    const secondaryIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!cardinalIndices.includes(i)) secondaryIndices.push(i);
    }

    const loadSingleFrame = (idx: number) => {
      const img = new Image();
      const numStr = idx.toString().padStart(2, '0');
      img.src = `/frames/frame_${numStr}.webp`;
      img.onload = () => {
        framesRef.current[idx] = img;
        loaded += 1;
        setLoadProgress(Math.round((loaded / totalToLoad) * 100));
      };
      img.onerror = () => {
        loaded += 1;
        setLoadProgress(Math.round((loaded / totalToLoad) * 100));
      };
    };

    // Load cardinals immediately
    cardinalIndices.forEach(loadSingleFrame);

    // Stream remaining frames in progressive batches with tiny timeouts to yield main thread
    let batchIdx = 0;
    const BATCH_SIZE = 4;
    const streamNextBatch = () => {
      if (batchIdx >= secondaryIndices.length) return;
      const batch = secondaryIndices.slice(batchIdx, batchIdx + BATCH_SIZE);
      batch.forEach(loadSingleFrame);
      batchIdx += BATCH_SIZE;
      setTimeout(streamNextBatch, 35);
    };

    const timer = setTimeout(streamNextBatch, 60);
    return () => clearTimeout(timer);
  }, []);

  // Window resize handler: Cap DPR to 2 for battery efficiency and 60-120 FPS silky smoothness
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    deadzoneRadiusRef.current = Math.min(width, height) * DEADZONE_RADIUS_FACTOR;
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Pointer & touch move listeners for smooth tracking across all mobile, tablet, and desktop devices
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      lastInteractionTimeRef.current = performance.now();
    };

    const handlePointerDown = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      lastInteractionTimeRef.current = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastInteractionTimeRef.current = performance.now();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Main 60-120 FPS Animation & Render Loop
  useEffect(() => {
    let animationId: number;
    let prevActiveFrame: number | 'CENTER' = 0;
    let prevDeadzone = false;

    const renderLoop = (time: number) => {
      animationId = requestAnimationFrame(renderLoop);

      // FPS calculation
      frameCountRef.current++;
      if (time - lastFpsTimeRef.current >= 1000) {
        currentFpsRef.current = Math.round(
          (frameCountRef.current * 1000) / (time - lastFpsTimeRef.current)
        );
        frameCountRef.current = 0;
        lastFpsTimeRef.current = time;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = canvas.width / dpr;
      const viewH = canvas.height / dpr;

      // 1. Fill solid studio blue background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Need at least center frame or one circular frame to draw
      if (!centerFrameRef.current && !framesRef.current[0]) {
        return;
      }

      // Calculate destination dimensions for 16:9 character frame
      const sourceAspect = 1920 / 1080;
      const isMobile = viewW < 768;
      const isTablet = viewW >= 768 && viewW < 1024;
      let destW: number;
      let destH: number;
      let destX: number;
      let destY: number;

      if (isMobile) {
        // Mobile portrait: Scale character so head & shoulders sit naturally in the upper 45% of viewport
        destW = Math.max(viewW * 1.35, Math.min(viewW * 1.6, 620));
        destH = destW / sourceAspect;
        destX = (viewW - destW) / 2;
        // Position character face gracefully in the upper 30-33% of viewport
        const targetFaceY = Math.max(180, Math.min(viewH * 0.32, 270));
        destY = targetFaceY - destH * FACE_NORM_Y;
      } else if (isTablet) {
        // Tablet: balanced framing leaving room for hero text on left
        const headroomFactor = 0.78;
        destH = viewH * headroomFactor;
        destW = destH * sourceAspect;
        destX = (viewW - destW) / 2 + viewW * 0.06;
        destY = viewH - destH;
      } else {
        // Desktop: luxury cinematic bottom-anchored frame
        const headroomFactor = 0.82;
        destH = viewH * headroomFactor;
        destW = destH * sourceAspect;

        const minW = Math.min(viewW, 1400) * 0.70;
        if (destW < minW) {
          destW = minW;
          destH = destW / sourceAspect;
        }

        destX = (viewW - destW) / 2;
        destY = viewH - destH;
      }

      // Calculate screen coordinate of the character's face center
      const faceX = destX + destW * FACE_NORM_X;
      const faceY = destY + destH * FACE_NORM_Y;
      faceScreenPosRef.current = { x: faceX, y: faceY };

      // Organic ambient gaze when idle (keeps the character alive and dynamic when not touching/moving)
      const now = performance.now();
      const idleElapsed = now - lastInteractionTimeRef.current;
      if (idleElapsed > 2200) {
        const t = now * 0.0009;
        const breathX = Math.sin(t * 1.1) * 60 + Math.cos(t * 0.35) * 40;
        const breathY = Math.cos(t * 0.8) * 35 + Math.sin(t * 0.45) * 20;
        mousePosRef.current = {
          x: faceX + breathX,
          y: faceY + breathY,
        };
      }

      if (onFaceCenterChange) {
        onFaceCenterChange({ x: faceX, y: faceY });
      }

      // Vector from face center to target
      const dx = mousePosRef.current.x - faceX;
      const dy = mousePosRef.current.y - faceY;
      const dist = Math.hypot(dx, dy);
      distanceRef.current = dist;

      // Check deadzone (direct eye contact)
      const inDeadzone = dist <= deadzoneRadiusRef.current;
      isDeadzoneRef.current = inDeadzone;

      if (inDeadzone && !prevDeadzone) {
        audioEngine.playEyeContact();
      }
      prevDeadzone = inDeadzone;

      // Calculate cursor angle
      let targetRad = Math.atan2(dy, dx);
      if (targetRad < 0) targetRad += Math.PI * 2;
      targetAngleRef.current = targetRad;

      // Ultra-smooth circular shortest-path lerp (organic tracking)
      smoothedAngleRef.current = lerpAngle(
        smoothedAngleRef.current,
        targetRad,
        LERP_FACTOR
      );
      let smoothed = smoothedAngleRef.current % (Math.PI * 2);
      if (smoothed < 0) smoothed += Math.PI * 2;
      smoothedAngleRef.current = smoothed;

      // Determine active frame
      let activeImage: HTMLImageElement | null = null;
      let activeFrameIndex: number | 'CENTER';

      if (inDeadzone && centerFrameRef.current) {
        activeImage = centerFrameRef.current;
        activeFrameIndex = 'CENTER';
      } else {
        const frameIdx = Math.round((smoothed / (Math.PI * 2)) * TOTAL_FRAMES) % TOTAL_FRAMES;
        activeImage = framesRef.current[frameIdx] || centerFrameRef.current || framesRef.current[0];
        activeFrameIndex = frameIdx;

        if (activeFrameIndex !== prevActiveFrame) {
          prevActiveFrame = activeFrameIndex;
        }
      }

      if (!activeImage) return;

      // Draw the crisp frame at exact dimensions
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(activeImage, destX, destY, destW, destH);

      // On mobile screens, softly dissolve the bottom edge of the shirt seamlessly into the solid blue canvas
      if (isMobile) {
        const fadeStartY = destY + destH * 0.68;
        const fadeHeight = destH * 0.32 + 4;
        const grad = ctx.createLinearGradient(0, fadeStartY, 0, fadeStartY + fadeHeight);
        grad.addColorStop(0, 'rgba(6, 15, 239, 0)');
        grad.addColorStop(0.55, 'rgba(6, 15, 239, 0.75)');
        grad.addColorStop(1, 'rgba(6, 15, 239, 1)');
        ctx.fillStyle = grad;
        ctx.fillRect(destX - 10, fadeStartY, destW + 20, fadeHeight + Math.max(0, viewH - (fadeStartY + fadeHeight)));
      }

      ctx.restore();

      // Throttled Telemetry Update (10 FPS / 100ms) to prevent React state re-render storm
      if (onTelemetryUpdate && time - lastTelemetrySendRef.current >= 100) {
        lastTelemetrySendRef.current = time;
        const currentDeg = Math.round((smoothed * 180) / Math.PI);
        const targetDeg = Math.round((targetRad * 180) / Math.PI);
        onTelemetryUpdate({
          fps: currentFpsRef.current,
          currentAngleDeg: currentDeg,
          targetAngleDeg: targetDeg,
          activeFrame: activeFrameIndex,
          isDeadzone: inDeadzone,
          distancePx: Math.round(dist),
          deadzoneRadiusPx: Math.round(deadzoneRadiusRef.current),
          cursorX: Math.round(mousePosRef.current.x),
          cursorY: Math.round(mousePosRef.current.y),
          loadedCount: framesRef.current.filter(Boolean).length + (centerFrameRef.current ? 1 : 0),
          totalCount: TOTAL_FRAMES + 1,
          isReady: isReady,
        });
      }
    };

    animationId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isReady, onTelemetryUpdate, onFaceCenterChange]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: BG_COLOR,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          backgroundColor: BG_COLOR,
        }}
      />

      {/* Subtle non-blocking streaming progress indicator (fades out when complete) */}
      {loadProgress < 100 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 5, 80, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '4px 12px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none',
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: '100%',
                background: '#ffffff',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
            }}
          >
            SYNCING {loadProgress}%
          </span>
        </div>
      )}
    </div>
  );
};
