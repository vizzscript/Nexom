import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    onConfirm?: () => void;
    variant?: 'danger' | 'primary';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    confirmLabel = 'Confirm',
    onConfirm,
    variant = 'primary'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-serif text-slate-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="text-slate-600 leading-relaxed">
                                {children}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 grid grid-cols-2 gap-4">
                            <button
                                onClick={onClose}
                                className="w-full px-6 py-3 rounded-full font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-lg transition-all"
                            >
                                Cancel
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all ${variant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                        : 'bg-[#d4af37] hover:bg-[#b5952f] shadow-yellow-100'
                                        }`}
                                >
                                    {confirmLabel}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
