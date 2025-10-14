import { themeContract } from '@shared/styles/theme.css';
import { style, keyframes } from '@vanilla-extract/css';

const modalSlideIn = keyframes({
  from: {
    transform: 'scale(0.9)',
  },
  to: {
    transform: 'scale(1)',
  },
});

const maskFadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const mask = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
});

export const maskOpen = style({
  opacity: 1,
  visibility: 'visible',
  animation: `${maskFadeIn} 0.2s ease-out`,
});

export const modal = style({
  position: 'relative',
  background: themeContract.background.base,
  borderRadius: themeContract.radius.default,
  boxShadow: `0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`,
  width: '520px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  transition: 'transform 0.2s ease-in-out',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    '(max-width: 768px)': {
      margin: '16px',
      width: 'auto',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 32px)',
    },
  },
});

export const modalOpen = style({
  transform: 'scale(1)',
  animation: `${modalSlideIn} 0.2s ease-out`,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${themeContract.spacing.lg} ${themeContract.spacing.xxl}`,
  borderBottom: `1px solid ${themeContract.colors.border}`,
  flexShrink: 0,

  '@media': {
    '(max-width: 768px)': {
      padding: `${themeContract.spacing.md} ${themeContract.spacing.lg}`,
    },
  },
});

export const title = style({
  fontSize: '16px',
  fontWeight: '600',
  color: themeContract.colors.textPrimary,
  margin: 0,
});

export const closeButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  color: themeContract.colors.textMuted,
  padding: '4px',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: '4px',
  transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',

  ':hover': {
    color: themeContract.colors.textPrimary,
    backgroundColor: themeContract.colors.bgLight,
  },
});

export const body = style({
  flex: 1,
  overflowY: 'auto',
  padding: `${themeContract.spacing.lg} ${themeContract.spacing.xxl}`,
  color: themeContract.colors.textPrimary,
  fontSize: '14px',

  '@media': {
    '(max-width: 768px)': {
      padding: themeContract.spacing.lg,
    },
  },
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: themeContract.spacing.sm,
  padding: `${themeContract.spacing.lg} ${themeContract.spacing.xxl}`,
  borderTop: `1px solid ${themeContract.colors.border}`,
  flexShrink: 0,

  '@media': {
    '(max-width: 768px)': {
      padding: `${themeContract.spacing.md} ${themeContract.spacing.lg}`,
    },
  },
});
