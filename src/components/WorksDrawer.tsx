import React, { useState } from 'react';
import { X, Sparkles, Briefcase, Layers, Wrench, ArrowUpRight, Tv } from 'lucide-react';
import { audioEngine } from './AudioEngine.ts';

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
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

const YouTubeIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface WorksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectItem {
  id: string;
  year: string;
  entity: string;
  role: string;
  description: string;
  tags: string[];
  isHighlighted?: boolean;
  instagramUrl?: string;
  instagramHandle?: string;
  mediaExposure?: { title: string; type: 'youtube' | 'instagram'; url: string }[];
}

const SELECTED_WORKS: ProjectItem[] = [
  {
    id: 'fifgroup',
    year: '2021 . Present',
    entity: 'FIFGROUP (DANASTRA)',
    role: 'Digital Content & Visual Communication',
    description:
      'Spearheaded digital content creation and strategic visual communication initiatives dedicated to internal corporate communications and enterprise campaigns at DANASTRA. Designed cohesive internal marketing collateral, employee engagement visual assets, and internal brand guidelines to streamline cross-departmental messaging. Ensured complex financial services and corporate initiatives were communicated with clarity, consistency, and professional visual impact.',
    tags: ['Internal Communication', 'Digital Content Creation', 'Visual Communication', 'Corporate Campaigns', 'Brand Communication'],
    isHighlighted: true,
  },
  {
    id: 'kitorato',
    year: '2019 . 2021',
    entity: 'Kitorato',
    role: 'Co-Founder',
    description:
      'Co-founded and scaled Kitorato as an entrepreneurial venture, directing brand development, creative business strategy, and end-to-end commercial operations. Spearheaded product presentation, spatial brand touchpoints, and customer journey design to drive organic engagement and customer loyalty. Gained extensive firsthand mastery in analyzing customer behavior, managing business activities, and translating creative concepts into viable enterprise growth.',
    tags: ['Brand Development', 'Business Operations', 'Entrepreneurship', 'Customer Experience', 'Creative Strategy'],
    mediaExposure: [
      {
        title: 'Hitam Putih Trans7',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=J6SggC0BOow',
      },
      {
        title: 'Asian Boss Español',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Vyi5dRCsU7E',
      },
      {
        title: '@kitorato.id',
        type: 'instagram',
        url: 'https://www.instagram.com/kitorato.id/',
      },
    ],
  },
  {
    id: 'permatabank',
    year: '2019',
    entity: 'PermataBank',
    role: 'Graphic Designer (HR Learning)',
    description:
      'Developed corporate visual collateral and internal learning communication assets for the enterprise HR Learning division. Created structured digital training modules, instructional infographics, and executive presentation materials to facilitate seamless knowledge transfer. Maintained strict visual compliance with banking design standards while modernizing internal corporate document layouts.',
    tags: ['Graphic Design', 'Internal Communication', 'Learning Material Design', 'Visual Content', 'Corporate Design'],
  },
];

const SIDE_PROJECTS: ProjectItem[] = [
  {
    id: 'digitalin',
    year: 'Side Project',
    entity: 'Digitalin',
    role: 'Creative Lab',
    instagramUrl: 'https://www.instagram.com/digitalin.labs',
    instagramHandle: '@digitalin.labs',
    description:
      'Personal creative lab exploring brand identity, experimental typography, and interactive digital content.',
    tags: ['Brand Identity', 'Creative Direction', 'Typography', 'Content Exploration'],
  },
  {
    id: 'tappi',
    year: 'Side Project',
    entity: 'TAPPI.id',
    role: 'SaaS Platform',
    instagramUrl: 'https://www.instagram.com/tappi.id/',
    instagramHandle: '@tappi.id',
    description:
      'Customer feedback and digital reputation platform built for small and medium businesses.',
    tags: ['SaaS', 'Product Design', 'Customer Feedback', 'Web App'],
    isHighlighted: true,
  },
];

const SKILLS_DATA = {
  designTools: [
    'Adobe Photoshop',
    'Figma',
    'CapCut',
    'Adobe Illustrator',
    'AI Tools',
  ],
  creativeSkills: [
    'Digital Content Creation',
    'Visual Communication',
    'Graphic Design',
    'Branding',
    'Social Media Content',
    'Layout Design',
    'Creative Direction',
  ],
  aiTools: [
    'AI Prompt Engineering',
    'AI-assisted Design Workflow',
    'Creative Automation',
  ],
};

export const WorksDrawer: React.FC<WorksDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'works' | 'projects' | 'skills'>('all');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(10, 10, 12, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid rgba(10, 10, 12, 0.1)',
          padding: 'clamp(24px, 4vw, 44px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          boxShadow: '-20px 0 60px rgba(10, 10, 12, 0.15)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(10, 10, 12, 0.08)',
            paddingBottom: '20px',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(10, 10, 12, 0.6)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              PORTFOLIO & PROFILE INDEX
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#0a0a0c',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Selected Works & Practice
            </h2>
            <p
              style={{
                margin: '6px 0 0 0',
                fontSize: '0.86rem',
                color: '#4a5260',
                lineHeight: 1.5,
              }}
            >
              Digital Content & Visual Communication Designer with 5+ years of professional experience across corporate environments and independent digital projects.
            </p>
          </div>

          <button
            onClick={() => {
              audioEngine.playClick(1000);
              onClose();
            }}
            aria-label="Close drawer"
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0c',
              background: 'rgba(10, 10, 12, 0.05)',
              border: '1px solid rgba(10, 10, 12, 0.1)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.05)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'works', label: '01. Selected Works' },
            { id: 'projects', label: '02. Side Projects' },
            { id: 'skills', label: '03. Skills & Tools' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playClick(1300);
                  setActiveTab(tab.id as any);
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  fontFamily: 'var(--font-sans)',
                  border: isActive
                    ? '1px solid #0a0a0c'
                    : '1px solid rgba(10, 10, 12, 0.12)',
                  backgroundColor: isActive
                    ? '#0a0a0c'
                    : 'rgba(10, 10, 12, 0.04)',
                  color: isActive ? '#ffffff' : 'rgba(10, 10, 12, 0.75)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '38px' }}>

          {/* 01. Selected Works */}
          {(activeTab === 'all' || activeTab === 'works') && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(10, 10, 12, 0.08)',
                }}
              >
                <Briefcase size={17} color="#0a0a0c" />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#0a0a0c',
                    margin: 0,
                  }}
                >
                  01. Selected Works
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {SELECTED_WORKS.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => audioEngine.playClick(1400)}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: item.isHighlighted
                        ? 'rgba(10, 10, 12, 0.035)'
                        : 'rgba(10, 10, 12, 0.02)',
                      border: item.isHighlighted
                        ? '1px solid rgba(10, 10, 12, 0.16)'
                        : '1px solid rgba(10, 10, 12, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: item.isHighlighted
                        ? '0 10px 30px rgba(10, 10, 12, 0.04)'
                        : 'none',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(10, 10, 12, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = item.isHighlighted
                        ? 'rgba(10, 10, 12, 0.035)'
                        : 'rgba(10, 10, 12, 0.02)';
                      e.currentTarget.style.borderColor = item.isHighlighted
                        ? 'rgba(10, 10, 12, 0.16)'
                        : 'rgba(10, 10, 12, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header line: Year • Company */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#5e6673',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.year} • {item.entity}
                      </span>
                      {item.isHighlighted && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#0a0a0c',
                            backgroundColor: 'rgba(10, 10, 12, 0.06)',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(10, 10, 12, 0.14)',
                          }}
                        >
                          Current Focus
                        </span>
                      )}
                    </div>

                    {/* Role / Title */}
                    <div>
                      <h4
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          color: '#0a0a0c',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {item.role}
                      </h4>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.62,
                        color: '#3d424a',
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 500,
                            background: 'rgba(10, 10, 12, 0.04)',
                            padding: '4px 11px',
                            borderRadius: '9999px',
                            color: '#0a0a0c',
                            border: '1px solid rgba(10, 10, 12, 0.08)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Featured Media Exposure if present */}
                    {item.mediaExposure && item.mediaExposure.length > 0 && (
                      <div
                        style={{
                          marginTop: '4px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          background: 'rgba(10, 10, 12, 0.025)',
                          border: '1px solid rgba(10, 10, 12, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(10, 10, 12, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Tv size={13} />
                          <span>Featured Exposure • Brand & Media Appearance</span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {item.mediaExposure.map((media) => (
                            <a
                              key={media.title}
                              href={media.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                audioEngine.playClick(1500);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 600,
                                color: '#0a0a0c',
                                backgroundColor: 'rgba(10, 10, 12, 0.05)',
                                padding: '5px 12px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(10, 10, 12, 0.12)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.12)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              {media.type === 'instagram' ? (
                                <InstagramIcon size={13} />
                              ) : (
                                <YouTubeIcon size={13} />
                              )}
                              <span>{media.title}</span>
                              <ArrowUpRight size={12} color="rgba(10, 10, 12, 0.5)" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 02. Side Projects */}
          {(activeTab === 'all' || activeTab === 'projects') && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(10, 10, 12, 0.08)',
                }}
              >
                <Layers size={17} color="#0a0a0c" />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#0a0a0c',
                    margin: 0,
                  }}
                >
                  02. Side Projects
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {SIDE_PROJECTS.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => audioEngine.playClick(1400)}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'rgba(10, 10, 12, 0.02)',
                      border: '1px solid rgba(10, 10, 12, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(10, 10, 12, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(10, 10, 12, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header line */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#5e6673',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.year}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#0a0a0c',
                          backgroundColor: 'rgba(10, 10, 12, 0.05)',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(10, 10, 12, 0.12)',
                        }}
                      >
                        {item.role}
                      </span>
                    </div>

                    {/* Title & Instagram Link */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          color: '#0a0a0c',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {item.entity}
                      </h4>

                      {item.instagramUrl && (
                        <a
                          href={item.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            audioEngine.playClick(1500);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: '#0a0a0c',
                            backgroundColor: 'rgba(10, 10, 12, 0.05)',
                            padding: '4px 11px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(10, 10, 12, 0.12)',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(10, 10, 12, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(10, 10, 12, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <InstagramIcon size={13} />
                          <span>{item.instagramHandle}</span>
                          <ArrowUpRight size={12} color="rgba(10, 10, 12, 0.5)" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.62,
                        color: '#3d424a',
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 500,
                            background: 'rgba(10, 10, 12, 0.04)',
                            padding: '4px 11px',
                            borderRadius: '9999px',
                            color: '#0a0a0c',
                            border: '1px solid rgba(10, 10, 12, 0.08)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 03. Skills & Tools */}
          {(activeTab === 'all' || activeTab === 'skills') && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(10, 10, 12, 0.08)',
                }}
              >
                <Wrench size={17} color="#0a0a0c" />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#0a0a0c',
                    margin: 0,
                  }}
                >
                  03. Skills & Tools
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Design Tools */}
                <div
                  style={{
                    padding: '22px',
                    borderRadius: '16px',
                    background: 'rgba(10, 10, 12, 0.02)',
                    border: '1px solid rgba(10, 10, 12, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0a0a0c',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Design Tools</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKILLS_DATA.designTools.map((tool) => (
                      <span
                        key={tool}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(10, 10, 12, 0.05)',
                          color: '#0a0a0c',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(10, 10, 12, 0.1)',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Creative Skills */}
                <div
                  style={{
                    padding: '22px',
                    borderRadius: '16px',
                    background: 'rgba(10, 10, 12, 0.02)',
                    border: '1px solid rgba(10, 10, 12, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0a0a0c',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Creative Skills</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKILLS_DATA.creativeSkills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(10, 10, 12, 0.05)',
                          color: '#0a0a0c',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(10, 10, 12, 0.1)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI & Emerging Tools */}
                <div
                  style={{
                    padding: '22px',
                    borderRadius: '16px',
                    background: 'rgba(10, 10, 12, 0.02)',
                    border: '1px solid rgba(10, 10, 12, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    gridColumn: '1 / -1',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0a0a0c',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={15} />
                    <span>AI & Emerging Tools</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKILLS_DATA.aiTools.map((tool) => (
                      <span
                        key={tool}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(10, 10, 12, 0.06)',
                          color: '#0a0a0c',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(10, 10, 12, 0.12)',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid rgba(10, 10, 12, 0.08)',
            fontSize: '0.8rem',
            color: 'rgba(10, 10, 12, 0.55)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Saldi Rahman • Digital Content & Visual Communication Designer
        </div>
      </div>
    </div>
  );
};
