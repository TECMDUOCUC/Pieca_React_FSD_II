import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Blogs from './Blogs';
import blogsData from '../data/blogs.json';

describe('Pruebas de renderizado de Blogs usando datos JSON', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
  });

  it('debe renderizar correctamente todos los blogs desde el JSON', async () => {
    root.render(
      <BrowserRouter>
        <Blogs />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Nuestros posts');

    blogsData.forEach((item) => {
      expect(container.textContent).toContain(item.title);
      expect(container.textContent).toContain(item.date);
      expect(container.textContent).toContain(item.description);
    });
  });
});