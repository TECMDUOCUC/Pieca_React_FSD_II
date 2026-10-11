import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const CARD_WIDTH = 250;
const GAP = 30;
const STEP = CARD_WIDTH + GAP;

export default function Carousel({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const trackOffset = containerWidth / 2 - CARD_WIDTH / 2 - activeIndex * STEP;

  return (
    <section className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h2 className="m-0 text-black fs-3">&bull; Nuestras piedras.</h2>
        <Link to="/catalog" className="btn btn-dark rounded-pill px-4">
          Ver todo
        </Link>
      </div>

      <div
        ref={containerRef}
        className="position-relative overflow-hidden py-5 w-100"
      >
        <button
          className="btn btn-link text-black position-absolute top-50 start-0 translate-middle-y z-3 fs-1 text-decoration-none"
          onClick={handlePrev}
          aria-label="Previous item"
          style={{ left: '10px' }}
        >
          &#8249;
        </button>

        <button
          className="btn btn-link text-black position-absolute top-50 end-0 translate-middle-y z-3 fs-1 text-decoration-none"
          onClick={handleNext}
          aria-label="Next item"
          style={{ right: '10px' }}
        >
          &#8250;
        </button>

        <div
          className="d-flex align-items-center"
          style={{
            transform: `translateX(${trackOffset}px)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            gap: `${GAP}px`
          }}
        >
          {items.map((item, index) => {
            const absDiff = Math.abs(index - activeIndex);
            const stateClass = absDiff === 0 ? 'active' : absDiff === 1 ? 'side' : 'far';

            return (
              <div
                key={item.id ?? index}
                className={`card carousel-card ${stateClass}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-between p-3 text-center text-white h-100 overflow-hidden">
                  <h5 className="card-title m-0 fs-6">{item.name}</h5>

                  <div className="carousel-card-media">
                    <img
                      src={`${import.meta.env.BASE_URL}${item.imgdir}`}
                      alt={item.name}
                      className="carousel-card-img"
                    />
                  </div>

                  <div className="carousel-btn-wrapper">
                      <Link
                        to={`/product?id=${item.id ?? index}`}
                        className="btn btn-light rounded-pill fw-bold px-4 py-1 carousel-visit-btn text-decoration-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visitar
                      </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}