export const memoHeaderRow = style({
  fontWeight: 'bold',
  color: '#374151',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const memoEditButton = style({
  padding: '5px 10px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
});
export const memoTextarea = style({
  width: '100%',
  minHeight: '80px',
  padding: '8px',
  border: '2px solid #3b82f6',
  borderRadius: '4px',
  fontSize: '14px',
  resize: 'vertical',
  fontFamily: 'inherit',
  outline: 'none',
});

export const memoEditActions = style({
  marginTop: '8px',
  display: 'flex',
  gap: '8px',
});

export const memoSaveButton = style({
  padding: '6px 12px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
});

export const memoCancelButton = style({
  padding: '6px 12px',
  backgroundColor: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
});

export const memoView = style({
  padding: '8px',
  borderRadius: '4px',
  fontSize: '14px',
  color: '#111827',
  cursor: 'pointer',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export const memoViewEmpty = style({
  color: '#9ca3af',
});

export const addressBox = style({
  padding: '8px',
  backgroundColor: '#e3f2fd',
  borderRadius: '4px',
  marginBottom: '10px',
  color: '#1976d2',
});

export const addressTitle = style({
  fontWeight: 'bold',
  marginBottom: '4px',
});

export const videosBox = style({
  marginTop: '10px',
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#f5f5f5',
  borderRadius: '5px',
});
import { style } from '@vanilla-extract/css';

export const detailsWrapper = style({
  minWidth: '280px',
  maxWidth: '400px',
});

export const coordsBox = style({
  marginBottom: '10px',
  padding: '8px',
  backgroundColor: '#f9fafb',
  borderRadius: '4px',
});

export const memoBox = style({
  padding: '12px',
  backgroundColor: '#fffbeb',
  borderRadius: '6px',
  marginBottom: '10px',
  border: '1px solid #fbbf24',
});

export const memoHeader = style({
  fontWeight: 'bold',
  color: '#374151',
  display: 'flex',
});
