import { style, keyframes } from '@vanilla-extract/css';

export const controlsWrapper = style({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
});

export const buttonBase = style({
  padding: '10px 16px',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
});

export const trackingOn = style({
  backgroundColor: '#F59E0B',
  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
});

export const trackingOff = style({
  backgroundColor: '#374151',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const createRoute = style({
  backgroundColor: '#10B981',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
  animation: `${keyframes({
    '0%': { boxShadow: '0 0 0 0 #10B981' },
    '70%': { boxShadow: '0 0 0 10px rgba(16,185,129,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0)' },
  })} 2s infinite`,
});

export const cancelConnection = style({
  backgroundColor: '#EF4444',
  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
});
