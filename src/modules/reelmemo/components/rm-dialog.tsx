import React from 'react';

interface RmDialogOption {
    id: string;
    label: string;
}

interface RmDialogProps {
    title: string;
    options: RmDialogOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    onClose: () => void;
}

/**
 * Componente modal reutilizable para seleccionar opciones.
 */
export const RmDialog: React.FC<RmDialogProps> = ({ title, options, selectedId, onSelect, onClose }) => {
    return (
        <div className="rm-dialog-overlay" onClick={onClose}>
            <div className="rm-dialog-content" onClick={e => e.stopPropagation()}>
                <h2 className="rm-dialog-title">{title}</h2>
                <div className="rm-dialog-list">
                    {options.map(option => (
                        <button 
                            key={option.id}
                            className={`rm-dialog-item ${selectedId === option.id ? 'selected' : ''}`}
                            onClick={() => {
                                onSelect(option.id);
                                onClose();
                            }}
                        >
                            <span className="rm-radio">{selectedId === option.id && <span className="rm-radio-inner" />}</span>
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="rm-dialog-actions">
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};
