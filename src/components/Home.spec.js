import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Home from './Home';
import { tick } from '../test/helpers';

describe('Home.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); });

  it('muestra Cargando cuando loading=true', async () => {
    root.render(<BrowserRouter><Home items={[]} loading={true} /></BrowserRouter>);
    await tick();
    expect(container.textContent).toContain('Cargando...');
  });

  it('muestra el contenido cuando loading=false', async () => {
    root.render(<BrowserRouter><Home items={[]} loading={false} /></BrowserRouter>);
    await tick();
    expect(container.textContent).toContain('Sobre nosotros');
    expect(container.textContent).toContain('Nuestro origen');
    expect(container.textContent).toContain('Ir al BLOG');
  });
});