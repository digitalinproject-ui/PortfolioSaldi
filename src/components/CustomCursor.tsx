import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const trail1Ref = useRef<HTMLDivElement | null>(null);
  const trail2Ref = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });

  const trail1Pos = useRef({ x: -100, y: -100 });
  const trail2Pos = useRef({ x: -100, y: -100 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine-pointer (desktop/mouse) devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
        trail1Pos.current = { x: e.clientX, y: e.clientY };
        trail2Pos.current = { x: e.clientX, y: e.clientY };
      }

      // Check interactive element hover
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], [data-cursor-hover]');
        setIsHovering(Boolean(interactive));
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Liquid physics loop
    let animId: number;

    const loop = () => {
      // Calculate velocity
      velocity.current.x = mousePos.current.x - prevMousePos.current.x;
      velocity.current.y = mousePos.current.y - prevMousePos.current.y;
      prevMousePos.current.x = mousePos.current.x;
      prevMousePos.current.y = mousePos.current.y;

      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      const angleRad = Math.atan2(velocity.current.y, velocity.current.x);
      const angleDeg = (angleRad * 180) / Math.PI;

      // Dynamic fluid stretch based on velocity
      const stretch = isHovering ? 0 : Math.min(speed * 0.016, 0.6);
      const scaleX = 1 + stretch;
      const scaleY = 1 / (1 + stretch * 0.7);

      // Trailing droplets follow with smooth viscous lerp
      const LERP_TRAIL_1 = 0.32;
      const LERP_TRAIL_2 = 0.18;

      trail1Pos.current.x += (mousePos.current.x - trail1Pos.current.x) * LERP_TRAIL_1;
      trail1Pos.current.y += (mousePos.current.y - trail1Pos.current.y) * LERP_TRAIL_1;

      trail2Pos.current.x += (trail1Pos.current.x - trail2Pos.current.x) * LERP_TRAIL_2;
      trail2Pos.current.y += (trail1Pos.current.y - trail2Pos.current.y) * LERP_TRAIL_2;

      // Render main droplet with fluid stretch
      if (mainRef.current) {
        mainRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%) rotate(${angleDeg}deg) scale(${scaleX}, ${scaleY})`;
      }

      // Render trailing liquid beads
      if (trail1Ref.current) {
        trail1Ref.current.style.transform = `translate(${trail1Pos.current.x}px, ${trail1Pos.current.y}px) translate(-50%, -50%)`;
      }
      if (trail2Ref.current) {
        trail2Ref.current.style.transform = `translate(${trail2Pos.current.x}px, ${trail2Pos.current.y}px) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible, isHovering]);

  return (
    <>
      {/* SVG Liquid Metaball Goo Filter */}
      <svg className="liquid-cursor-svg" aria-hidden="true">
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 19 -8
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Fluid Liquid Cursor Container with Metaball Filter */}
      <div
        className="liquid-cursor-container"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Trailing secondary bead */}
        <div ref={trail2Ref} className="liquid-droplet-trail-2" />

        {/* Trailing primary bead */}
        <div ref={trail1Ref} className="liquid-droplet-trail-1" />

        {/* Main liquid droplet (stretches along velocity and morphs on hover) */}
        <div
          ref={mainRef}
          className={`liquid-droplet-main ${isHovering ? 'is-hovering' : ''}`}
        />
      </div>
    </>
  );
};
