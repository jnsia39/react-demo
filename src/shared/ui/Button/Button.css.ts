import { themeContract } from '@shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const button = style({
  border: `1px solid ${themeContract.colors.border}`,
  borderRadius: themeContract.radius.default,
  cursor: 'pointer',
  transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',

  ':hover': {
    background: themeContract.colors.bgLight,
  },

  ':disabled': {
    background: themeContract.colors.bgLight,
    color: themeContract.colors.textMuted,
    cursor: 'default',
  },
});

export const sizeVariants = styleVariants({
  small: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  medium: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  large: {
    padding: '12px 24px',
    fontSize: '16px',
  },
});

export const variantStyles = styleVariants({
  primary: {
    background: themeContract.colors.primary,
    color: themeContract.colors.bgPrimary,
    borderColor: themeContract.colors.primary,

    ':hover:not(:disabled)': {
      background: themeContract.colors.primary,
      filter: 'brightness(0.9)',
    },
  },

  secondary: {
    background: themeContract.colors.bgPrimary,
    color: themeContract.colors.textPrimary,
    borderColor: themeContract.colors.border,

    ':hover:not(:disabled)': {
      background: themeContract.colors.bgSecondary,
    },
  },

  danger: {
    background: themeContract.colors.danger,
    color: themeContract.colors.bgPrimary,
    borderColor: themeContract.colors.danger,

    ':hover:not(:disabled)': {
      background: themeContract.colors.danger,
      filter: 'brightness(0.9)',
    },
  },

  outline: {
    background: 'transparent',
    borderWidth: '2px',

    ':hover:not(:disabled)': {
      background: themeContract.colors.bgSecondary,
    },
  },
});
