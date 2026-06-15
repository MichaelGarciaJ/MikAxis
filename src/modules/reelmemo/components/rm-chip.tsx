import React from 'react';

interface RmChipProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    showDropdownIcon?: boolean;
    variant?: 'default' | 'genre';
}

/**
 * Componente reutilizable para los Chips (Filtros/Categorías).
 */
export const RmChip: React.FC<RmChipProps> = ({ 
    label, 
    isActive = false, 
    onClick, 
    showDropdownIcon = false,
    variant = 'default'
}) => {
    const baseClass = variant === 'genre' ? 'rm-genre-chip' : 'rm-chip';
    const activeClass = isActive ? 'active' : '';
    
    // If it's a genre chip, it usually acts as a static label, but we still use the button or span
    if (variant === 'genre') {
        return (
            <span className={baseClass}>
                {label}
            </span>
        );
    }
    return (
        <button 
            className={`${baseClass} ${activeClass}`.trim()}
            onClick={onClick}
        >
            {label}
            {showDropdownIcon && <span className="rm-chip-icon">▼</span>}
        </button>
    );
};
