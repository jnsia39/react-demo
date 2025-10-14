import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '12px 16px',
  backgroundColor: '#3B82F6',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  maxWidth: '250px',
});

export const text = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
