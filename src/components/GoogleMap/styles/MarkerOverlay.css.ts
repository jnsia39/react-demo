import { style, keyframes } from '@vanilla-extract/css';

export const overlayBase = style({
  position: 'absolute',
  transform: 'translate(-50%, -70%)',
  width: '80px',
  height: '80px',
  cursor: 'grab',
  borderRadius: '50%',
  transition: 'all 0.2s',
});

export const dragOver = style({
  backgroundColor: 'rgba(66, 165, 245, 0.2)',
  border: '3px solid #2196F3',
  animation: `${keyframes({
    '0%': { boxShadow: '0 0 0 0 #2196F3' },
    '70%': { boxShadow: '0 0 0 10px rgba(33,150,243,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(33,150,243,0)' },
  })} 1s infinite`,
});

export const normal = style({
  backgroundColor: 'transparent',
  border: 'none',
  animation: 'none',
});
