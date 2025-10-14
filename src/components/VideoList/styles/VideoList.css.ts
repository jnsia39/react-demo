import { style, keyframes } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: '100%',
  backgroundColor: '#f9fafb',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const header = style({
  padding: '16px',
  backgroundColor: 'white',
  borderBottom: '1px solid #e5e7eb',
  flexShrink: 0,
});

export const title = style({
  margin: '0 0 12px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#111827',
});

export const addButton = style({
  padding: '8px 16px',
  backgroundColor: '#3B82F6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  ':hover': {
    backgroundColor: '#2563EB',
  },
});

export const content = style({
  flex: 1,
  overflow: 'auto',
  padding: '16px',
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loadingContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
});

export const spinner = style({
  width: '32px',
  height: '32px',
  border: '3px solid #f3f4f6',
  borderTop: '3px solid #3B82F6',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
  marginBottom: '12px',
});

export const loadingText = style({
  color: '#6B7280',
  fontSize: '14px',
  margin: 0,
});

export const emptyContainer = style({
  textAlign: 'center',
  padding: '40px 20px',
  color: '#6B7280',
});

export const emptyTitle = style({
  fontSize: '16px',
  margin: '0 0 8px 0',
});

export const emptyDescription = style({
  fontSize: '14px',
  margin: 0,
});

export const videoListContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const hint = style({
  textAlign: 'center',
  padding: '8px',
  backgroundColor: '#EBF8FF',
  borderRadius: '6px',
  fontSize: '12px',
  color: '#1E40AF',
  border: '1px dashed #60A5FA',
});

export const videoItem = style({
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  cursor: 'grab',
  transition: 'all 0.2s ease',
});

export const videoItemSelected = style({
  backgroundColor: '#EBF8FF',
  borderColor: '#3B82F6',
});

export const thumbnail = style({
  width: '60px',
  height: '40px',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  marginRight: '12px',
  overflow: 'hidden',
  flexShrink: 0,
});

export const thumbnailImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const thumbnailPlaceholder = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  color: '#6B7280',
});

export const videoInfo = style({
  flex: 1,
});

export const videoName = style({
  fontSize: '14px',
  fontWeight: '500',
  color: '#111827',
  marginBottom: '4px',
});

export const videoMeta = style({
  fontSize: '12px',
  color: '#6B7280',
  display: 'flex',
  gap: '12px',
});

export const deleteButton = style({
  padding: '4px 8px',
  backgroundColor: '#EF4444',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '11px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#DC2626',
  },
});

export const preview = style({
  padding: '16px',
  backgroundColor: 'white',
  borderTop: '1px solid #e5e7eb',
  flexShrink: 0,
});

export const previewTitle = style({
  margin: '0 0 12px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
});

export const videoPlayer = style({
  width: '100%',
  maxHeight: '200px',
  backgroundColor: '#000',
  borderRadius: '4px',
});
