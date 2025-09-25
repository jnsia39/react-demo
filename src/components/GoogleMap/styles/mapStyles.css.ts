/**
 * Map styles prepared for vanilla-extract migration
 * Currently exporting as plain objects, but structured for easy conversion
 */

import { theme } from '../../../styles/theme';

const container = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
};

const map = {
  width: '100%',
  height: '100%',
};

const dropZone = {
  base: {
    position: 'absolute' as const,
    width: '60px',
    height: '60px',
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translate(-50%, -50%)',
    transition: theme.transitions.base,
    zIndex: theme.zIndex.dropdown,
  },
  active: {
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
    border: '3px dashed #4ade80',
  },
  inactive: {
    backgroundColor: theme.colors.transparent,
    border: '3px dashed transparent',
  },
  icon: {
    fontSize: theme.fontSize.xl,
  },
};

const infoWindow = {
  container: {
    padding: theme.spacing[5],
    minWidth: '250px',
    maxWidth: '350px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[5],
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing[2],
    marginRight: theme.spacing[5],
  },
  typeSelect: {
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.base,
    backgroundColor: theme.colors.white,
    cursor: 'pointer',
    minWidth: '100px',
  },
  input: {
    width: '100%',
    padding: theme.spacing[3],
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing[3],
  },
  textarea: {
    width: '100%',
    padding: theme.spacing[3],
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing[3],
    minHeight: '60px',
    resize: 'vertical' as const,
  },
  info: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  videoSection: {
    marginTop: theme.spacing[5],
    paddingTop: theme.spacing[5],
    borderTop: `1px solid ${theme.colors.gray[200]}`,
  },
  videoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing[3],
    color: theme.colors.text.primary,
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing[2],
  },
  videoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[2],
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.base,
  },
  videoName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    marginRight: theme.spacing[3],
  },
  removeButton: {
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    cursor: 'pointer',
  },
  noVideos: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.disabled,
    fontStyle: 'italic' as const,
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing[3],
    marginTop: theme.spacing[5],
  },
  button: {
    base: {
      padding: `${theme.spacing[2]} ${theme.spacing[5]}`,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.bold,
      cursor: 'pointer',
      transition: theme.transitions.fast,
    },
    save: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
    },
    delete: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.white,
    },
  },
};

export const mapStyles = {
  container,
  map,
  dropZone,
  infoWindow,
};