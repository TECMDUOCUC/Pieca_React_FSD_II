import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Index from './Index';
import { mockFetch, SAMPLE_ROCKS, cleanStorage, tick } from '../test/helpers';

describe('Index.jsx', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  it('renderiza la home completa con rocas de la API', async () => {
    mock = mockFetch([{ match: '/api/rocks', body: SAMPLE_ROCKS }]);
    root.render(<BrowserRouter><Index /></BrowserRouter>);
    await tick(120);
    expect(container.textContent).toContain('Nuestras piedras');
    expect(container.textContent).toContain('Sobre nosotros');
    expect(container.querySelectorAll('.carousel-card').length).toBe(3);
  });

  it('backend caído no rompe la home (carrusel vacío)', async () => {
    mock = mockFetch([{ match: '/api/rocks', networkError: true }]);
    root.render(<BrowserRouter><Index /></BrowserRouter>);
    await tick(120);
    expect(container.textContent).toContain('Sobre nosotros');
    expect(container.querySelectorAll('.carousel-card').length).toBe(0);
  });
});