import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <button className="confirm-modal__close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <h2 className="confirm-modal__title">{title}</h2>
                <p className="confirm-modal__message">{message}</p>

                <div className="confirm-modal__actions">
                    <button
                        className={`confirm-modal__btn confirm-modal__btn--confirm ${isDanger ? 'confirm-modal__btn--danger' : ''
                            }`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        className="confirm-modal__btn confirm-modal__btn--cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
