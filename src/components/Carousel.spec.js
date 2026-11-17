import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Carousel from './Carousel';
import { SAMPLE_ROCKS, tick } from '../test/helpers';

describe('Carousel.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); });

  const render = (items) =>
    root.render(<BrowserRouter><Carousel items={items} /></BrowserRouter>);

  it('renderiza tarjetas con estado active/side/far', async () => {
    render(SAMPLE_ROCKS);
    await tick();
    expect(container.querySelectorAll('.carousel-card.active').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.carousel-card.side').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.carousel-card.far').length).toBeGreaterThan(0);
  });

  it('botón prev vuelve al último item', async () => {
    render(SAMPLE_ROCKS);
    await tick();
    container.querySelector('[aria-label="Previous item"]').click();
    await tick();
    const cards = container.querySelectorAll('.carousel-card');
    expect(cards[2].classList.contains('active')).toBe(true);
  });

  it('botón next avanza al siguiente item', async () => {
    render(SAMPLE_ROCKS);
    await tick();
    container.querySelector('[aria-label="Next item"]').click();
    await tick();
    const cards = container.querySelectorAll('.carousel-card');
    expect(cards[1].classList.contains('active')).toBe(true);
  });

  it('no rompe con items vacío', async () => {
    render([]);
    await tick();
    expect(container.querySelectorAll('.carousel-card').length).toBe(0);
  });
});