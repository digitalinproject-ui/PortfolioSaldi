import React from 'react';
import { Activity, Compass, Eye, Cpu } from 'lucide-react';
import { TelemetryData } from './CharacterCanvas.tsx';
import { audioEngine } from './AudioEngine.ts';

interface TelemetryHudProps {
  telemetry: TelemetryData | null;
  onSelectCompassDirection: (deg: number | 'CENTER') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const TelemetryHud: React.FC<TelemetryHudProps> = ({
  telemetry,
  onSelectCompassDirection,
  isOpen,
  onToggle,
}) => {
  if (!telemetry) return null;

  const {
    fps,
    currentAngleDeg,
    activeFrame,
    isDeadzone,
    distancePx,
    deadzoneRadiusPx,
  } = telemetry;

  const compassPoints = [
    { label: 'N', deg: 270, title: 'UP' },
    { label: 'NE', deg: 315, title: 'UP-RIGHT' },
    { label: 'E', deg: 0, title: 'RIGHT' },
    { label: 'SE', deg: 45, title: 'DOWN-RIGHT' },
    { label: 'S', deg: 90, title: 'DOWN' },
    { label: 'SW', deg: 135, title: 'DOWN-LEFT' },
    { label: 'W', deg: 180, title: 'LEFT' },
    { label: 'NW', deg: 225, title: 'UP-LEFT' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '32px',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Telemetry Panel */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            borderRadius: '20px',
            padding: '20px 24px',
            width: '320px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 25px 60px rgba(0, 10, 80, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="#00f0ff" />
              <span
                className="font-display"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Neural Telemetry
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                padding: '3px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#00f0ff',
              }}
            >
              <Activity size={12} />
              <span>{fps} FPS</span>
            </div>
          </div>

          {/* Compass & Angle Dial */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Visual Compass Dial */}
            <div
              style={{
                position: 'relative',
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '1px dashed rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              {/* Compass Needle (rotated by current smoothed angle) */}
              <div
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '32px',
                  backgroundColor: isDeadzone ? '#e8d08d' : '#00f0ff',
                  transformOrigin: 'bottom center',
                  transform: `translateY(-16px) rotate(${currentAngleDeg + 90}deg)`,
                  transition: 'transform 0.05s linear',
                  boxShadow: isDeadzone
                    ? '0 0 10px #e8d08d'
                    : '0 0 10px #00f0ff',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-3px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isDeadzone ? '#e8d08d' : '#00f0ff',
                  }}
                />
              </div>

              {/* Dial Center */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  zIndex: 2,
                }}
              />
            </div>

            {/* Readouts */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>AZIMUTH</span>
                <span style={{ color: '#00f0ff', fontWeight: 600 }}>
                  {currentAngleDeg}°
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>FRAME</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {activeFrame === 'CENTER' ? 'CENTER (239)' : `#${activeFrame} / 63`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>DISTANCE</span>
                <span>
                  {distancePx}px / {deadzoneRadiusPx}px
                </span>
              </div>
            </div>
          </div>

          {/* Deadzone Status Pill */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDeadzone
                ? 'rgba(232, 208, 141, 0.18)'
                : 'rgba(255, 255, 255, 0.05)',
              border: isDeadzone
                ? '1px solid rgba(232, 208, 141, 0.45)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye
                size={15}
                color={isDeadzone ? '#e8d08d' : 'rgba(255, 255, 255, 0.6)'}
              />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  color: isDeadzone ? '#e8d08d' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: isDeadzone ? 700 : 500,
                }}
              >
                {isDeadzone ? 'DEADZONE • EYE CONTACT' : 'ORBITAL TRACKING'}
              </span>
            </div>

            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isDeadzone ? '#e8d08d' : '#00f0ff',
                boxShadow: isDeadzone ? '0 0 8px #e8d08d' : '0 0 8px #00f0ff',
              }}
            />
          </div>

          {/* 8 Compass Direction Quick-Pointers */}
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Manual Pointers (8 Directions)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
              }}
            >
              {compassPoints.map((pt) => (
                <button
                  key={pt.label}
                  onClick={() => {
                    audioEngine.playCompassTick();
                    onSelectCompassDirection(pt.deg);
                  }}
                  className="glass-pill"
                  title={`${pt.title} (${pt.deg}°)`}
                  style={{
                    padding: '6px 0',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer',
                    borderRadius: '8px',
                  }}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {/* Center Eye Contact Button */}
            <button
              onClick={() => {
                audioEngine.playEyeContact();
                onSelectCompassDirection('CENTER');
              }}
              className="glass-pill"
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '7px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: '#e8d08d',
                borderColor: 'rgba(232, 208, 141, 0.35)',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <Eye size={13} />
              <span>SNAP EYE CONTACT (CENTER)</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          audioEngine.playClick(1100);
          onToggle();
        }}
        className="glass-pill"
        style={{
          pointerEvents: 'auto',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#ffffff',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0, 5, 60, 0.35)',
        }}
      >
        <Compass size={16} color="#00f0ff" />
        <span
          className="font-display"
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {isOpen ? 'Hide Telemetry' : 'Live HUD'}
        </span>
      </button>
    </div>
  );
};
