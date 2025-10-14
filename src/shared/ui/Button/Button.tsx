import clsx from 'clsx';
import React from 'react';

import * as styles from './Button.css';
import Spinner from '../Spinner';

type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles.sizeVariants[size],
        styles.variantStyles[variant]
      )}
      onClick={onClick}
      style={style}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
