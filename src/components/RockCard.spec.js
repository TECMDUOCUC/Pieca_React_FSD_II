import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import RockCard from './RockCard';
import { SAMPLE_ROCKS, tick } from '../test/helpers';

describe('RockCard.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); });

  it('renderiza nombre, precio CLP y link al id real de BD', async () => {
    root.render(<BrowserRouter><RockCard item={SAMPLE_ROCKS[0]} /></BrowserRouter>);
    await tick();
    expect(container.textContent).toContain('Piedra algo ovalada');
    expect(container.textContent).toContain('1.299');
    expect(container.querySelector('a').getAttribute('href')).toBe('/product/1');
  });

  it('muestra Agotado cuando stock es 0', async () => {
    root.render(<BrowserRouter><RockCard item={SAMPLE_ROCKS[2]} /></BrowserRouter>);
    await tick();
    expect(container.textContent).toContain('Agotado');
  });

  it('resuelve imágenes subidas al backend', async () => {
    const uploaded = { ...SAMPLE_ROCKS[0], imgdir: '/uploads/rocks/abc.webp' };
    root.render(<BrowserRouter><RockCard item={uploaded} /></BrowserRouter>);
    await tick();
    expect(container.querySelector('img').src).toBe('http://localhost:8080/uploads/rocks/abc.webp');
  });
});