import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Carousel from './Carousel';
import rocksData from '../data/rocks.json';

describe('Carousel.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); });

  it('renderiza las tarjetas con estado active/side/far', async () => {
    root.render(<BrowserRouter><Carousel items={rocksData.slice(0, 3)} /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelectorAll('.carousel-card.active').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.carousel-card.side').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.carousel-card.far').length).toBeGreaterThan(0);
  });

  it('botón prev vuelve al último item', async () => {
    root.render(<BrowserRouter><Carousel items={rocksData.slice(0, 3)} /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const prev = container.querySelector('[aria-label="Previous item"]');
    prev.click();
    await new Promise(r => setTimeout(r, 50));
    // After prev from 0, activeIndex should be items.length - 1 = 2
    // The third card should now be active
    const cards = container.querySelectorAll('.carousel-card');
    expect(cards[2].classList.contains('active')).toBe(true);
  });

  it('botón next avanza al siguiente item', async () => {
    root.render(<BrowserRouter><Carousel items={rocksData.slice(0, 3)} /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const next = container.querySelector('[aria-label="Next item"]');
    next.click();
    await new Promise(r => setTimeout(r, 50));
    const cards = container.querySelectorAll('.carousel-card');
    expect(cards[1].classList.contains('active')).toBe(true);
  });

  it('no rompe con items vacío', async () => {
    root.render(<BrowserRouter><Carousel items={[]} /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelectorAll('.carousel-card').length).toBe(0);
  });
});