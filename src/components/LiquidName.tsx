import React, { useEffect, useRef, useCallback } from 'react';
import { audioEngine } from './AudioEngine.ts';

interface LiquidNameProps {
  className?: string;
  style?: React.CSSProperties;
}

interface LetterNode {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  rot: number;
}

export const LiquidName: React.FC<LiquidNameProps> = ({ className = '', style = {} }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const word1Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const word2Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const dropletRef = useRef<HTMLDivElement | null>(null);

  const word1Chars = ['S', 'a', 'l', 'd', 'i'];
  const word2Chars = ['R', 'a', 'h', 'm', 'a', 'n'];

  const nodes1Ref = useRef<LetterNode[]>(
    word1Chars.map((char) => ({
      char,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      scaleX: 1,
      scaleY: 1,
      rot: 0,
    }))
  );

  const nodes2Ref = useRef<LetterNode[]>(
    word2Chars.map((char) => ({
      char,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      scaleX: 1,
      scaleY: 1,
      rot: 0,
    }))
  );

  const mousePosRef = useRef<{ x: number; y: number; active: boolean; speed: number }>({
    x: -9999,
    y: -9999,
    active: false,
    speed: 0,
  });

  const lastMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const dropletPosRef = useRef<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });
  const lastSoundRef = useRef<number>(0);
  const rAFRef = useRef<number | null>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const now = performance.now();
    const dt = Math.max(1, now - lastMouseRef.current.time);
    const dist = Math.hypot(e.clientX - lastMouseRef.current.x, e.clientY - lastMouseRef.current.y);
    const speed = Math.min(2.5, dist / dt);

    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
      active: true,
      speed,
    };

    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
  }, []);

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current.active = false;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const SPRING = 0.12;
    const DAMPING = 0.82;
    const INFLUENCE_RADIUS = 190;
    const MAX_PULL = 44; // Maximum liquid stretch distance

    const simulateLiquid = () => {
      const mouse = mousePosRef.current;
      const container = containerRef.current;
      let activeInteraction = false;
      let closestPoint = { x: 0, y: 0, dist: 9999 };

      if (container) {
        // Process both lines of text
        const wordGroups = [
          { chars: word1Chars, nodes: nodes1Ref.current, refs: word1Refs.current },
          { chars: word2Chars, nodes: nodes2Ref.current, refs: word2Refs.current },
        ];

        wordGroups.forEach((group) => {
          // 1. Find the letter closest to the cursor in this line
          let nearestIdx = -1;
          let minDistance = 9999;
          let nearestVector = { dx: 0, dy: 0 };

          group.refs.forEach((el, idx) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouse.x - cx;
            const dy = mouse.y - cy;
            const dist = Math.hypot(dx, dy);

            if (dist < minDistance) {
              minDistance = dist;
              nearestIdx = idx;
              nearestVector = { dx, dy };
            }
          });

          // 2. Apply elastic fluid ribbon deformation
          const hasProximity = mouse.active && minDistance < INFLUENCE_RADIUS;
          if (hasProximity) {
            activeInteraction = true;
            if (minDistance < closestPoint.dist) {
              closestPoint = {
                x: mouse.x,
                y: mouse.y,
                dist: minDistance,
              };
            }
          }

          group.nodes.forEach((node, idx) => {
            const el = group.refs[idx];
            if (!el) return;

            let targetX = 0;
            let targetY = 0;
            let targetScaleX = 1;
            let targetScaleY = 1;
            let targetRot = 0;

            if (hasProximity && nearestIdx >= 0) {
              // Gaussian falloff curve along neighboring letters (fluid continuity)
              const neighborFactor = Math.exp(-Math.pow(idx - nearestIdx, 2) / 2.8);
              const proximityFactor = Math.pow(1 - minDistance / INFLUENCE_RADIUS, 1.5);
              const totalInfluence = neighborFactor * proximityFactor;

              const angle = Math.atan2(nearestVector.dy, nearestVector.dx);
              const pull = totalInfluence * MAX_PULL;

              targetX = Math.cos(angle) * pull;
              targetY = Math.sin(angle) * pull;

              // Viscous elongation along vector, pinch perpendicularly (liquid volume conservation)
              targetScaleX = 1 + totalInfluence * 0.35;
              targetScaleY = 1 - totalInfluence * 0.18;
              targetRot = Math.sin(angle) * totalInfluence * 12;

              // Tactile liquid micro-sound
              const now = performance.now();
              if (totalInfluence > 0.45 && now - lastSoundRef.current > 200) {
                lastSoundRef.current = now;
                audioEngine.playEyeContact();
              }
            }

            // Spring relaxation physics
            const ax = (targetX - node.x) * SPRING;
            const ay = (targetY - node.y) * SPRING;

            node.vx = (node.vx + ax) * DAMPING;
            node.vy = (node.vy + ay) * DAMPING;

            node.x += node.vx;
            node.y += node.vy;

            node.scaleX += (targetScaleX - node.scaleX) * 0.15;
            node.scaleY += (targetScaleY - node.scaleY) * 0.15;
            node.rot += (targetRot - node.rot) * 0.15;

            // Apply fluid matrix transform
            el.style.transform = `translate3d(${node.x.toFixed(2)}px, ${node.y.toFixed(
              2
            )}px, 0) scale(${node.scaleX.toFixed(3)}, ${node.scaleY.toFixed(3)}) rotate(${node.rot.toFixed(2)}deg)`;
          });
        });

        // Viscous droplet bridge following cursor when near
        if (dropletRef.current) {
          const containerRect = container.getBoundingClientRect();
          const targetOpacity = activeInteraction && closestPoint.dist < 140 ? 0.8 : 0;
          dropletPosRef.current.opacity += (targetOpacity - dropletPosRef.current.opacity) * 0.15;

          if (dropletPosRef.current.opacity > 0.05) {
            const relX = mouse.x - containerRect.left;
            const relY = mouse.y - containerRect.top;
            dropletPosRef.current.x += (relX - dropletPosRef.current.x) * 0.25;
            dropletPosRef.current.y += (relY - dropletPosRef.current.y) * 0.25;

            dropletRef.current.style.transform = `translate3d(${dropletPosRef.current.x.toFixed(1)}px, ${dropletPosRef.current.y.toFixed(1)}px, 0) scale(${dropletPosRef.current.opacity.toFixed(2)})`;
            dropletRef.current.style.opacity = dropletPosRef.current.opacity.toFixed(2);
          } else {
            dropletRef.current.style.opacity = '0';
          }
        }
      }

      rAFRef.current = requestAnimationFrame(simulateLiquid);
    };

    rAFRef.current = requestAnimationFrame(simulateLiquid);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <div
      ref={containerRef}
      className={`liquid-name-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        lineHeight: 0.92,
        userSelect: 'none',
        cursor: 'pointer',
        filter: 'drop-shadow(0 4px 24px rgba(0, 5, 80, 0.5))',
        ...style,
      }}
    >
      {/* Viscous fluid follower bead connecting cursor with the text */}
      <div
        ref={dropletRef}
        style={{
          position: 'absolute',
          top: -8,
          left: -8,
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 16px rgba(255, 255, 255, 0.8), 0 0 30px rgba(6, 15, 239, 0.4)',
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          zIndex: 2,
        }}
      />

      {/* Line 1: Saldi */}
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          overflow: 'visible',
        }}
      >
        {word1Chars.map((char, idx) => (
          <span
            key={`w1-${char}-${idx}`}
            ref={(el) => {
              word1Refs.current[idx] = el;
            }}
            style={{
              display: 'inline-block',
              willChange: 'transform',
              transformOrigin: 'center bottom',
              transition: 'filter 0.1s ease',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Line 2: Rahman */}
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          overflow: 'visible',
        }}
      >
        {word2Chars.map((char, idx) => (
          <span
            key={`w2-${char}-${idx}`}
            ref={(el) => {
              word2Refs.current[idx] = el;
            }}
            style={{
              display: 'inline-block',
              willChange: 'transform',
              transformOrigin: 'center bottom',
              transition: 'filter 0.1s ease',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};
