import clsx from 'clsx';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import * as styles from './Modal.css';
import Button from '../Button';

interface ModalProps {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  width?: string | number;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'secondary' | 'danger';
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  footer?: React.ReactNode | null;
  getContainer?: HTMLElement | (() => HTMLElement);
  onOk?: (e: React.MouseEvent) => void;
  onCancel?: (e: React.MouseEvent) => void;
  afterClose?: () => void;
}

export default function Modal({
  open,
  title,
  children,
  closable = true,
  closeIcon,
  maskClosable = true,
  destroyOnClose = false,
  okText = '확인',
  cancelText = '취소',
  style,
  bodyStyle,
  maskStyle,
  footer,
  onOk,
  onCancel,
  afterClose,
}: ModalProps) {
  useEffect(() => {
    if (!open && afterClose) {
      const timer = setTimeout(afterClose, 200);
      return () => clearTimeout(timer);
    }
  }, [open, afterClose]);

  const handleMaskClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === e.currentTarget) {
      onCancel?.(e);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    onCancel?.(e);
  };

  if (!open && destroyOnClose) {
    return null;
  }

  const renderFooter = () => {
    if (footer === null) return null;

    if (footer) return footer;

    return (
      <div className={styles.footer}>
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button onClick={onOk}>{okText}</Button>
      </div>
    );
  };

  const modalContent = (
    <div
      className={clsx(styles.mask, open && styles.maskOpen)}
      style={maskStyle}
      onClick={handleMaskClick}
    >
      <div
        className={clsx(styles.modal, open && styles.modalOpen)}
        style={style}
      >
        {(title || closable) && (
          <div className={styles.header}>
            {title && <div className={styles.title}>{title}</div>}
            {closable && (
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close"
              >
                {closeIcon || 'X'}
              </button>
            )}
          </div>
        )}

        <div className={styles.body} style={bodyStyle}>
          {children}
        </div>

        {renderFooter()}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
