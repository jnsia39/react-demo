import { globalStyle, style, keyframes } from '@vanilla-extract/css';

import { themeContract } from './theme.css';

globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

globalStyle('body', {
  fontFamily: 'Pretendard Variable',
  background: '#f5f5f5',
  color: themeContract.colors.text,
  minWidth: '720px',
});

export const container = style({
  minWidth: '1200px',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '16px 0px',

  '@media': {
    '(max-width: 2200px)': {
      margin: '0 16px',
      padding: '16px 0px',
    },
  },
});

const fadeIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const fadeInAnimation = style({
  animation: `${fadeIn} 0.3s ease-out`,
});
