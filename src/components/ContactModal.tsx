import React, { useState } from 'react';
import { X, CheckCircle2, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { audioEngine } from './AudioEngine.ts';

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playEyeContact();
    
    // Construct WhatsApp message with user input
    const messageText = `Hi Saldi, my name is ${form.name} (${form.email}).\n\nProject Scope / Inquiry:\n${form.message}`;
    const waUrl = `https://wa.me/6282390822245?text=${encodeURIComponent(messageText)}`;
    
    // Open WhatsApp directly
    window.open(waUrl, '_blank');

    setSubmitted(true);
  };

  const contactChannels = [
    {
      label: 'Email',
      value: 'saldirahman1112@gmail.com',
      href: 'mailto:saldirahman1112@gmail.com',
      icon: <Mail size={16} />,
    },
    {
      label: 'WhatsApp',
      value: '+62 823-9082-2245',
      href: 'https://wa.me/6282390822245',
      icon: <MessageCircle size={16} />,
    },
    {
      label: 'Instagram',
      value: '@salinheree',
      href: 'https://www.instagram.com/salinheree',
      icon: <InstagramIcon size={16} />,
    },
  ];

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
          padding: 'clamp(28px, 4vw, 40px)',
          backgroundColor: 'rgba(4, 10, 190, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 30px 80px rgba(0, 5, 80, 0.8)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={() => {
            audioEngine.playClick(1000);
            setSubmitted(false);
            onClose();
          }}
          className="glass-pill"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div
            style={{
              padding: '40px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <CheckCircle2 size={48} color="#ffffff" />
            <h3
              style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', margin: 0 }}
            >
              Opening WhatsApp...
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.82)',
                lineHeight: 1.6,
                margin: '0 0 12px 0',
                maxWidth: '420px',
              }}
            >
              Your inquiry has been routed directly to WhatsApp. If the chat window did not open automatically, click the button below to continue.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/6282390822245?text=${encodeURIComponent(
                  `Hi Saldi, my name is ${form.name} (${form.email}).\n\nProject Scope / Inquiry:\n${form.message}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioEngine.playClick(1400)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#060fef',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={15} />
                <span>Continue to WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', message: '' });
                  onClose();
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#ffffff',
                opacity: 0.85,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              DIRECT INQUIRIES
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '8px',
                marginTop: 0,
              }}
            >
              Let's Connect
            </h3>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.78)',
                lineHeight: 1.5,
                marginBottom: '20px',
                marginTop: 0,
              }}
            >
              Reach out directly for digital content initiatives, corporate visual communication, brand design, or creative collaborations.
            </p>

            {/* Direct Contact Channels */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              {contactChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioEngine.playClick(1400)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {channel.icon}
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{channel.label}</span>
                    </div>
                    <ArrowUpRight size={14} color="rgba(255, 255, 255, 0.6)" />
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {channel.value}
                  </span>
                </a>
              ))}
            </div>

            {/* Subtle Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.14)' }} />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                or leave a message
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.14)' }} />
            </div>

            {/* Direct Message Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '5px',
                  }}
                >
                  Your Name / Organization
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Acme Studio / Full Name"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '5px',
                  }}
                >
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '5px',
                  }}
                >
                  Message / Project Scope
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details regarding your campaign goals, design requirements, or timeline..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                className="luxury-btn"
                style={{
                  marginTop: '4px',
                  width: '100%',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  gap: '8px',
                }}
              >
                <MessageCircle size={17} />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
