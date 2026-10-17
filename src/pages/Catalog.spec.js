import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import CatalogPage from './Catalog';
import rocksData from '../data/rocks.json';

describe('Pruebas de renderizado de Catálogo usando datos JSON', () => {
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

  it('debe renderizar correctamente todas las piedras desde el JSON', async () => {
    root.render(
      <BrowserRouter>
        <CatalogPage />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Catálogo Pieca');

    rocksData.forEach((rock) => {
      expect(container.textContent).toContain(rock.name);
    });
  });

  it('debe mostrar el conteo correcto de productos', async () => {
    root.render(
      <BrowserRouter>
        <CatalogPage />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain(`${rocksData.length} producto(s) encontrados.`);
  });

  it('debe renderizar un botón Visitar por cada piedra', async () => {
    root.render(
      <BrowserRouter>
        <CatalogPage />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const visitButtons = container.querySelectorAll('.carousel-visit-btn');
    expect(visitButtons.length).toBe(rocksData.length);
  });

  it('debe filtrar piedras al escribir en el buscador', async () => {
    root.render(
      <BrowserRouter>
        <CatalogPage />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const searchInput = container.querySelector('#catalog-search');
    // We use the first rock's name to ensure a match exists in the current JSON
    const firstRockName = rocksData[0].name;

    // Simulate typing into the input
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(searchInput, firstRockName.toLowerCase());
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain(firstRockName);
    expect(container.textContent).toContain('1 producto(s) encontrados.');
  });

  it('debe mostrar estado vacío cuando no hay coincidencias', async () => {
    root.render(
      <BrowserRouter>
        <CatalogPage />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const searchInput = container.querySelector('#catalog-search');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(searchInput, 'xyznonexistent');
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('No se encontraron productos.');
    expect(container.textContent).toContain('0 producto(s) encontrados.');
  });
});