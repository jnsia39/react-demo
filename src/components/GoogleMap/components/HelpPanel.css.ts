import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  zIndex: 1000,
  fontSize: '13px',
  lineHeight: '1.6',
});

export const toggleButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
});

export const toggleIcon = style({
  fontSize: '12px',
  color: '#3B82F6',
});

export const toggleText = style({
  userSelect: 'none',
});

export const content = style({
  marginTop: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '20px',
  maxWidth: '380px',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
});

export const title = style({
  margin: '0 0 16px 0',
  fontSize: '16px',
  fontWeight: '700',
  color: '#1f2937',
  borderBottom: '2px solid #3B82F6',
  paddingBottom: '8px',
});

export const section = style({
  marginBottom: '16px',
  ':last-child': {
    marginBottom: 0,
  },
});

export const sectionTitle = style({
  margin: '0 0 8px 0',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
});

export const list = style({
  margin: 0,
  paddingLeft: '20px',
  color: '#4b5563',
});

export const kbd = style({
  display: 'inline-block',
  padding: '2px 6px',
  fontSize: '11px',
  fontWeight: '600',
  lineHeight: '1',
  color: '#374151',
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  fontFamily: 'monospace',
  marginRight: '4px',
});
