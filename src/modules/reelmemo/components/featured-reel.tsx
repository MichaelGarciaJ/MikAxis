import React, { useState, useEffect } from 'react';
import { MediaEntity } from '../../../data/entity/media';
import { mediaService } from '../../../data/service/media-service';
import { Plus, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../../../config/firebase';

/**
 * Propiedades esperadas para el componente FeaturedReel.
 */
interface FeaturedReelProps {
    data: Partial<MediaEntity>;
}

/**
 * Componente FeaturedReel
 * Muestra el póster destacado en grande con estilo Netflix y botones de acción rápida.
 * 
 * @param {FeaturedReelProps} props Propiedades del componente
 * @returns {JSX.Element | null} Componente renderizado
 */
export const FeaturedReel: React.FC<FeaturedReelProps> = ({ data }) => {
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [loading, setLoading] = useState(false);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const checkStatus = async () => {
            if (!data.id || !userId) return;
            const { status } = await mediaService.getMediaStatus(userId, data.id);
            setIsInLibrary(status !== 'none');
        };
        checkStatus();
    }, [data.id, userId]);

    const handleToggleList = async () => {
        if (loading || !data.id || !userId) return;
        setLoading(true);
        try {
            if (isInLibrary) {
                await mediaService.removeFromLibrary(userId, data.id);
                setIsInLibrary(false);
            } else {
                await mediaService.saveToLibrary(userId, data, "pending");
                setIsInLibrary(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    return (
        <div className="rm-featured-reel">
            <div 
                className="rm-featured-bg" 
                style={{ backgroundImage: `url(${data.backdropUrl || data.imageUrl})` }}
            >
                <div className="rm-featured-overlay">
                    <h2 className="rm-featured-title">{data.title}</h2>
                    <div className="rm-featured-actions">
                        <Link to={`/reelmemo/details/${data.type}/${data.id}`} className="rm-btn-primary">
                            <Info size={18} />
                            <span>Detalles</span>
                        </Link>
                        <button 
                            onClick={handleToggleList} 
                            className={`rm-btn-secondary ${isInLibrary ? 'active' : ''}`}
                            disabled={loading}
                        >
                            {isInLibrary ? <Check size={18} /> : <Plus size={18} />}
                            <span>{isInLibrary ? "En mi lista" : "Mi Lista"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
