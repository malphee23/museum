import React, { useRef, useState } from 'react';
import PhotoStand from './PhotoStand';
import { stands } from './stands';
import Styles from './StandCarousel.module.css';

export default function StandCarousel({ onPhotoClick }) {
  const track = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [index, setIndex] = useState(0);
  const goTo = (position) => {
    const viewport = track.current;
    const slide = viewport.children[position];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({ left: slide.offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  return (
    <section className={Styles.Carousel} aria-label="Фотоальбомы — музейные стенды" aria-roledescription="слайдер">
      <div ref={track} className={Styles.Track} tabIndex={0} aria-label="Прокручиваемая лента стендов"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(Math.max(0, Math.min(stands.length - 1, index + (event.key === 'ArrowLeft' ? -1 : 1))));
          }
        }}
        onScroll={() => {
          const viewport = track.current;
          const atEnd = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 2;
          const closest = Array.from(viewport.children).reduce((best, slide, position, slides) =>
            Math.abs(slide.offsetLeft - viewport.scrollLeft) < Math.abs(slides[best].offsetLeft - viewport.scrollLeft) ? position : best, 0);
          setIndex(atEnd ? stands.length - 1 : closest);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return;
          suppressClick.current = false;
          drag.current = { x: event.clientX, left: track.current.scrollLeft };
          track.current.setPointerCapture(event.pointerId);
          track.current.style.scrollSnapType = 'none';
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const distance = event.clientX - drag.current.x;
          if (Math.abs(distance) > 5) suppressClick.current = true;
          track.current.scrollLeft = drag.current.left - distance;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
          track.current.style.scrollSnapType = '';
        }}
        onPointerUp={(event) => {
          if (track.current.hasPointerCapture(event.pointerId)) track.current.releasePointerCapture(event.pointerId);
        }}
        onClickCapture={(event) => {
          if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
        }}
        onDragStart={(event) => event.preventDefault()}>
        {stands.map((stand) => (
          <div key={stand.id} className={Styles.Slide} style={{ '--stand-ratio': stand.width / 1280 }}>
            <PhotoStand stand={stand} onPhotoClick={onPhotoClick} />
          </div>
        ))}
      </div>
      <div className={Styles.Controls}>
        <button type="button" className={Styles.Arrow} aria-label="Предыдущий стенд" disabled={index === 0} onClick={() => goTo(index - 1)}>‹</button>
        <p className={Styles.Caption} aria-live="polite" aria-atomic="true">
          <span className={Styles.Counter}>{index + 1} / {stands.length}</span>
          <span>{stands[index].title}</span>
        </p>
        <button type="button" className={Styles.Arrow} aria-label="Следующий стенд" disabled={index === stands.length - 1} onClick={() => goTo(index + 1)}>›</button>
      </div>
      <div className={Styles.Dots} aria-label="Перейти к стенду">
        {stands.map((stand, position) => (
          <button type="button" key={stand.id} className={Styles.Dot}
            aria-label={`${position + 1}. ${stand.title}`} aria-current={position === index ? 'true' : undefined}
            onClick={() => goTo(position)} />
        ))}
      </div>
    </section>
  );
}
