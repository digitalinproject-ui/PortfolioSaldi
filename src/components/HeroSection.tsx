import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { TelemetryData } from './CharacterCanvas.tsx';
import { audioEngine } from './AudioEngine.ts';

interface HeroSectionProps {
  telemetry: TelemetryData | null;
  onOpenWorks: () => void;
  onOpenContact: () => void;
  onResumeClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenContact,
  onResumeClick,
}) => {
  const handleResume = () => {
    audioEngine.playClick(1200);
    if (onResumeClick) {
      onResumeClick();
    } else {
      window.open('#resume', '_blank');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Subtle protective bottom gradient scrim on mobile for 100% WCAG AA text clarity */}
      <div className="hero-mobile-scrim" />

      {/* Hero Typography & Actions */}
      <div
        className="hero-content-wrapper"
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 5vh, 60px)',
          left: 'clamp(20px, 4.5vw, 64px)',
          width: 'calc(100% - 40px)',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'auto',
          zIndex: 25,
        }}
      >
        {/* 1. Kicker / Greeting in clean spaced Plus Jakarta Sans */}
        <div
          className="font-sans"
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.78)',
          }}
        >
          Hi, I'm
        </div>

        {/* 2. Primary Focal Point: 2-line Name in Dripdrop font */}
        <h1
          className="font-name"
          style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 5.4rem)',
            fontWeight: 400,
            color: '#ffffff',
            lineHeight: 0.94,
            margin: '0 0 6px 0',
            filter: 'drop-shadow(0 4px 20px rgba(0, 5, 80, 0.45))',
            letterSpacing: '0.02em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            userSelect: 'none',
          }}
        >
          <span>Saldi</span>
          <span>Rahman</span>
        </h1>

        {/* 3. Role & Experience Badge / Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            margin: '2px 0 2px 0',
          }}
        >
          <div
            className="font-sans"
            style={{
              fontSize: '1.02rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            Digital Content & Visual Communication
          </div>

          <div
            className="font-sans"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            5+ Years Experience
          </div>
        </div>

        {/* 4. Compact 3-line bio (max-width ~350px) */}
        <p
          className="font-sans"
          style={{
            maxWidth: '350px',
            fontSize: '0.9rem',
            lineHeight: 1.58,
            color: 'rgba(255, 255, 255, 0.82)',
            margin: '2px 0 8px 0',
          }}
        >
          Crafting compelling digital content, strategic corporate visual communication, and customer-centric brand experiences that command attention.
        </p>

        {/* 5. Two stylish white pill buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '4px',
            flexWrap: 'wrap',
          }}
        >
          {/* Resume button: Solid white with arrow icon */}
          <button
            onClick={handleResume}
            onMouseEnter={() => audioEngine.playClick(1500)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#060fef',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 5, 80, 0.28)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 5, 80, 0.45), 0 0 20px rgba(255, 255, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 5, 80, 0.28)';
            }}
          >
            <span>Resume</span>
            <ArrowUpRight size={17} strokeWidth={2.4} />
          </button>

          {/* Let's Talk button: Frosted glass / white border */}
          <button
            onClick={() => {
              audioEngine.playClick(1100);
              onOpenContact();
            }}
            onMouseEnter={() => audioEngine.playClick(1500)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 5, 80, 0.2)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 5, 80, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 5, 80, 0.2)';
            }}
          >
            <MessageSquare size={16} />
            <span>Let's Talk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
