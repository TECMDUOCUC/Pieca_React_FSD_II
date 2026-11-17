import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import CatalogPage from './Catalog';
import { mockFetch, withAuth, SAMPLE_ROCKS, cleanStorage, tick, setInput } from '../test/helpers';

describe('Catalog.jsx (conectado al backend)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const render = () => root.render(withAuth(<BrowserRouter><CatalogPage /></BrowserRouter>, null));

  it('carga y renderiza las rocas desde la API', async () => {
    mock = mockFetch([{ match: '/api/rocks', body: SAMPLE_ROCKS }]);
    render();
    await tick();
    expect(container.textContent).toContain('Catálogo Pieca');
    SAMPLE_ROCKS.forEach((r) => expect(container.textContent).toContain(r.name));
    expect(container.textContent).toContain('3 producto(s) encontrados.');
    expect(mock.calls.some(c => c.path === '/api/rocks')).toBe(true);
  });

  it('filtra al escribir en el buscador', async () => {
    mock = mockFetch([{ match: '/api/rocks', body: SAMPLE_ROCKS }]);
    render();
    await tick();
    setInput(container.querySelector('#catalog-search'), 'sigma');
    await tick();
    expect(container.textContent).toContain('Piedra Sigma');
    expect(container.textContent).toContain('1 producto(s) encontrados.');
  });

  it('muestra estado vacío sin coincidencias', async () => {
    mock = mockFetch([{ match: '/api/rocks', body: SAMPLE_ROCKS }]);
    render();
    await tick();
    setInput(container.querySelector('#catalog-search'), 'xyznonexistent');
    await tick();
    expect(container.textContent).toContain('No se encontraron productos.');
    expect(container.textContent).toContain('0 producto(s) encontrados.');
  });

  it('muestra error si el backend falla', async () => {
    mock = mockFetch([{ match: '/api/rocks', networkError: true }]);
    render();
    await tick();
    expect(container.textContent).toContain('No se pudo conectar');
  });
});