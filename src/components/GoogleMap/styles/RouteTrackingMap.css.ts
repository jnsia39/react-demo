import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const controlsContainer = style({
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const mapContainer = style({
  width: '100%',
  height: '100%',
});

export const searchBox = style({
  boxSizing: 'border-box',
  border: '1px solid transparent',
  width: '300px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipsis',
  position: 'absolute',
  right: '60px',
  top: '10px',
});
