import React from 'react';
import { MediaEntity } from '../../../data/entity/media';

import { Link } from 'react-router-dom';
import { Film, Tv } from 'lucide-react';

/**
 * Propiedades para el componente MediaCard.
 */
type MediaCardProps = {
  media: MediaEntity;
};

/**
 * Componente de tarjeta para visualizar una película o serie.
 * Al hacer clic navega a los detalles.
 */
export const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  return (
    <Link to={`/reelmemo/details/${media.type || 'movie'}/${media.id}`} className="rm-media-card" style={{ textDecoration: 'none' }}>
      <div className="rm-media-poster-container" style={{ position: 'relative' }}>
        {media.imageUrl ? (
          <img src={media.imageUrl} alt={media.title} className="rm-media-poster" loading="lazy" />
        ) : (
          <div className="rm-media-poster-placeholder">Sin Imagen</div>
        )}
        <div className="rm-media-type-badge">
            {media.type === 'tv' ? <Tv size={16} /> : <Film size={16} />}
        </div>
      </div>
      <div className="rm-media-overlay">
        <h4 className="rm-media-title">{media.title}</h4>
      </div>
    </Link>
  );
};
