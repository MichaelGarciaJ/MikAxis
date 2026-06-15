import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, Loader2, X } from 'lucide-react';
import './toast.css';

/**
 * Tipos de notificaciones soportadas.
 */
export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'loading';

/**
 * Representa una notificación en el sistema.
 */
interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

/**
 * Contexto global de notificaciones.
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook para usar el sistema de notificaciones.
 * @returns {ToastContextType} Métodos para mostrar y ocultar Toasts.
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used dentro de un ToastProvider');
    return context;
};

/**
 * Proveedor del contexto de notificaciones.
 * Debe envolver a la aplicación para habilitar `useToast`.
 * @param children - Elementos hijos de React
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Muestra una nueva notificación en pantalla.
     * @param message - Texto de la notificación
     * @param type - Tipo de notificación (success, error, etc.)
     * @param duration - Duración en ms antes de desaparecer
     */
    const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);

        if (type !== 'loading') {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type} slide-in`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                            {toast.type === 'warning' && <AlertTriangle size={20} />}
                            {toast.type === 'error' && <XCircle size={20} />}
                            {toast.type === 'loading' && <Loader2 size={20} className="spinner" />}
                        </div>
                        <p className="toast-message">{toast.message}</p>
                        {toast.type !== 'loading' && (
                            <button className="toast-close" onClick={() => removeToast(toast.id)}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
