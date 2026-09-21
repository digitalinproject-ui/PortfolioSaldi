import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CharacterCanvas, TelemetryData } from './components/CharacterCanvas.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { TelemetryHud } from './components/TelemetryHud.tsx';
import { WorksDrawer } from './components/WorksDrawer.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { audioEngine } from './components/AudioEngine.ts';

export const App: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isWorksOpen, setIsWorksOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const faceCenterPosRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.38,
  });

  // Permanently unlock Web Audio API on first mobile touch or click gesture
  useEffect(() => {
    const handleFirstGesture = () => {
      audioEngine.unlock();
    };

    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchend', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('touchend', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, []);

  const handleFaceCenterChange = useCallback((pos: { x: number; y: number }) => {
    faceCenterPosRef.current = pos;
  }, []);

  // Dispatch simulated pointer event to programmatically test compass direction
  const handleSelectCompassDirection = (degOrCenter: number | 'CENTER') => {
    const face = faceCenterPosRef.current;
    if (degOrCenter === 'CENTER') {
      const event = new PointerEvent('pointermove', {
        clientX: face.x,
        clientY: face.y,
        bubbles: true,
      });
      window.dispatchEvent(event);
      return;
    }

    const rad = (degOrCenter * Math.PI) / 180;
    const targetX = face.x + Math.cos(rad) * 350;
    const targetY = face.y + Math.sin(rad) * 350;

    const event = new PointerEvent('pointermove', {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#060fef',
        overflow: 'hidden',
      }}
    >
      {/* Custom Glowing Magnetic Cursor */}
      <CustomCursor />

      {/* Subtle organic noise overlay for luxury depth */}
      <div className="noise-overlay" />

      {/* 
        Full Screen Canvas: covers 100vw, 100vh with object-fit: cover
        Zero CSS 3D transforms, 100% rock-solid motionless body.
        Pre-extracted WebP frames, zero ghosting, deadzone eye contact.
      */}
      <CharacterCanvas
        onTelemetryUpdate={setTelemetry}
        onFaceCenterChange={handleFaceCenterChange}
      />

      {/* Floating Frosted-Glass Navigation Pill Centered at Top */}
      <Navigation
        onOpenWorks={() => setIsWorksOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Bottom-Left Hero Typography & Action Buttons */}
      <HeroSection
        telemetry={telemetry}
        onOpenWorks={() => setIsWorksOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onResumeClick={() => setIsAboutOpen(true)}
      />

      {/* Interactive Telemetry HUD (tucked in bottom-right) */}
      <TelemetryHud
        telemetry={telemetry}
        onSelectCompassDirection={handleSelectCompassDirection}
        isOpen={isHudOpen}
        onToggle={() => setIsHudOpen(!isHudOpen)}
      />

      {/* Project Showcase Drawer */}
      <WorksDrawer isOpen={isWorksOpen} onClose={() => setIsWorksOpen(false)} />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenContact={() => {
          setIsAboutOpen(false);
          setIsContactOpen(true);
        }}
      />

      {/* Contact Inquiry Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};
