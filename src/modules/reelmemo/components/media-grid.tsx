import React from 'react';
import { MediaEntity } from '../../../data/entity/media';
import { MediaCard } from './media-card';

/**
 * Propiedades para el componente MediaGrid.
 */
type MediaGridProps = {
  items: MediaEntity[];
};

/**
 * Componente de cuadrícula (grid) que renderiza múltiples tarjetas de películas o series.
 */
export const MediaGrid: React.FC<MediaGridProps> = ({ items }) => {
  if (items.length === 0) {
    return <div className="rm-empty-state">No hay resultados en esta categoría.</div>;
  }

  return (
    <div className="rm-media-grid">
      {items.map((item) => (
        <MediaCard key={item.id} media={item} />
      ))}
    </div>
  );
};
