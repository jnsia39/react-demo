export const buttonGroup = style({
  display: 'flex',
  gap: '8px',
});

export const buttonBase = style({
  padding: '6px 12px',
  fontSize: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 500,
});

export const editButton = style({
  backgroundColor: '#F59E0B',
});

export const deleteButton = style({
  backgroundColor: '#EF4444',
});

export const saveButton = style({
  backgroundColor: '#10B981',
});

export const cancelButton = style({
  backgroundColor: '#6B7280',
});
import { style } from '@vanilla-extract/css';

export const listWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  borderRadius: '12px',
  padding: '16px',
});

export const listTitle = style({
  fontWeight: 600,
  fontSize: '14px',
  alignItems: 'center',
  width: 320,
  gap: '8px',
});

export const routeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
});

export const routeRowEditing = style({
  border: '2px solid #F59E0B',
});

export const routeInfo = style({
  flex: 1,
});

export const routeName = style({
  fontSize: '14px',
  fontWeight: 500,
  color: '#111827',
});

export const routeDesc = style({
  fontSize: '12px',
  color: '#6B7280',
  marginTop: '2px',
});
