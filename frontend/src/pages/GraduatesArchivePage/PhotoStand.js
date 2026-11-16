import React, { useLayoutEffect, useRef, useState } from 'react';
import { resolveMediaUrl } from '../../shared/const/api';
import outline from '../../shared/assets/stands/photo-outline.svg';
import tallOutline from '../../shared/assets/stands/photo-outline-tall.svg';
import Styles from './PhotoStand.module.css';

export default function PhotoStand({ stand, onPhotoClick }) {
  const boardWidth = stand.width;
  const host = useRef(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const resize = () => setScale(host.current.getBoundingClientRect().width / boardWidth);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [boardWidth]);

  return (
    <article ref={host} className={Styles.Frame} style={{ aspectRatio: `${boardWidth} / 1280` }} aria-label={stand.title}>
      <div className={Styles.Board} data-figma-node={stand.nodeId}
        style={{ width: boardWidth, transform: `scale(${scale})` }}>
        <h2 className={Styles.Heading} style={{ top: stand.titleTop - 8, width: boardWidth - 48 }}>
          {stand.lines.map((line, index) => (
            <span key={line} style={{ fontSize: stand.lines.length === 3 && index === 1 ? 48 : 58 }}>{line}</span>
          ))}
        </h2>
        {stand.slots.map((slot, index) => {
          const photo = slot.photo;
          const geometry = { left: slot.x - 8, top: slot.y - 8, width: slot.width, height: slot.height };
          const border = (
            <span aria-hidden="true"
              className={Styles.Outline}
              style={{ backgroundImage: `url(${slot.tallOutline ? tallOutline : outline})` }} />
          );
          return photo ? (
            <button key={index} type="button" className={`${Styles.Slot} ${Styles.PhotoButton}`} style={geometry}
              aria-label={`Открыть фотографию: ${photo.title}`} onClick={() => onPhotoClick(photo)}>
              <img className={Styles.Photo} src={resolveMediaUrl(photo.image?.image_url || photo.image?.image)}
                alt={photo.title} loading="lazy" style={{ objectPosition: photo.image?.object_position || '50% 50%' }} />
              {border}
            </button>
          ) : (
            <div key={index} className={Styles.Slot} style={geometry}
              role="img" aria-label={`Место для фотографии ${index + 1}`}>
              {border}
            </div>
          );
        })}
      </div>
    </article>
  );
}
