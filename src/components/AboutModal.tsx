import { X, Layout, Sparkles } from 'lucide-react';
import { audioEngine } from './AudioEngine.ts';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(6, 15, 239, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '24px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '24px',
          padding: '40px',
          backgroundColor: 'rgba(4, 10, 190, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 30px 80px rgba(0, 5, 80, 0.8)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={() => {
            audioEngine.playClick(1000);
            onClose();
          }}
          className="glass-pill"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="#ffffff" />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            About Me
          </span>
        </div>

        <h2
          className="font-name"
          style={{
            fontSize: '3.2rem',
            color: '#ffffff',
            lineHeight: 1.05,
            marginBottom: '8px',
            filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.35))',
          }}
        >
          Saldi Rahman
        </h2>

        <div
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#ffffff',
            opacity: 0.9,
            letterSpacing: '0.04em',
            marginBottom: '16px',
          }}
        >
          Digital Content & Visual Communication Designer • 5+ Years Exp.
        </div>

        <p
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.68,
            color: 'rgba(255, 255, 255, 0.86)',
            marginBottom: '24px',
          }}
        >
          Combining over five years of corporate visual communication experience (FIFGROUP & PermataBank), entrepreneurial brand-building insight as Co-Founder at Kitorato, and independent digital product ventures (Digitalin & TAPPI.id). Dedicated to crafting strategic, aesthetic, and impactful visual content that commands attention.
        </p>

        {/* Skill areas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ffffff' }}>
              <Layout size={16} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Creative Practice</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.6 }}>
              Visual Communication, Digital Content Creation, Corporate Campaigns, Brand Identity, Layout Design
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ffffff' }}>
              <Sparkles size={16} color="#ffffff" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Tools & Emerging Tech</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.6 }}>
              Adobe Photoshop, Figma, CapCut, Illustrator, AI-assisted Design & Prompt Workflows
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => {
              audioEngine.playClick(1200);
              onClose();
              onOpenContact();
            }}
            className="luxury-btn"
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: '14px 20px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
            }}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
};
