import { Button } from './Button';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', paddingTop: '8px' }}>
        {/* Warning icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--color-danger-dim)',
            border: '1px solid rgba(224, 92, 92, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-danger)',
          }}
        >
          <AlertTriangle size={22} />
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            style={{ flex: 1 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
