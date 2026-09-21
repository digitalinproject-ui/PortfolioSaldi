import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from './AudioEngine.ts';

interface NavigationProps {
  onOpenWorks: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenWorks,
  onOpenAbout,
  onOpenContact,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    audioEngine.enabled = nextState;
    setSoundEnabled(nextState);
    if (nextState) {
      audioEngine.playClick(1400);
    }
  };

  const navItems = [
    { label: 'Work', onClick: onOpenWorks },
    { label: 'About', onClick: onOpenAbout },
    { label: 'Contact', onClick: onOpenContact },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px 8px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '9999px',
          boxShadow: '0 12px 36px rgba(0, 5, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              audioEngine.playClick(1100);
              item.onClick();
            }}
            onMouseEnter={() => audioEngine.playClick(1600)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.84rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              padding: '8px 16px',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {item.label}
          </button>
        ))}

        {/* Subtle Divider */}
        <div
          style={{
            width: '1px',
            height: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            margin: '0 4px',
          }}
        />

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          style={{
            background: 'transparent',
            border: 'none',
            color: soundEnabled ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
      </nav>
    </header>
  );
};
