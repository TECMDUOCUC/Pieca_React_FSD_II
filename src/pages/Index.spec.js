import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Index from './Index';

describe('Index.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
  });
  afterEach(() => { root.unmount(); container.remove(); localStorage.clear(); });

  it('renderiza la home completa', async () => {
    root.render(<BrowserRouter><Index /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 100));
    expect(container.textContent).toContain('Nuestras piedras');
    expect(container.textContent).toContain('Sobre nosotros');
    expect(container.textContent).toContain('Pieca');
  });
});