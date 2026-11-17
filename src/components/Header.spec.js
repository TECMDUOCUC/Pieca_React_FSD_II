import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Header from './Header';
import { mockFetch, withAuth, meRoute, ADMIN, SELLER, CLIENT, cleanStorage, tick, findButton } from '../test/helpers';

describe('Header.jsx', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  it('muestra Registrarse/Iniciar Sesión sin sesión', async () => {
    mock = mockFetch([]);
    root.render(withAuth(<BrowserRouter><Header /></BrowserRouter>, null));
    await tick();
    expect(container.textContent).toContain('Registrarse');
    expect(container.textContent).toContain('Iniciar Sesión');
    expect(container.textContent).not.toContain('Cerrar Sesión');
  });

  it('cliente ve Carrito/Mis Pedidos pero NO Panel', async () => {
    mock = mockFetch([meRoute(CLIENT)]);
    root.render(withAuth(<BrowserRouter><Header /></BrowserRouter>, CLIENT));
    await tick();
    expect(container.textContent).toContain('Carrito');
    expect(container.textContent).toContain('Mis Pedidos');
    expect(container.textContent).not.toContain('Panel');
    expect(container.textContent).toContain('CLIENTE');
  });

  it('seller y admin ven Panel con su chip de rol', async () => {
    mock = mockFetch([meRoute(SELLER)]);
    root.render(withAuth(<BrowserRouter><Header /></BrowserRouter>, SELLER));
    await tick();
    expect(container.textContent).toContain('Panel');
    expect(container.textContent).toContain('VENDEDOR');
  });

  it('logout limpia el token y vuelve al estado anónimo', async () => {
    mock = mockFetch([meRoute(ADMIN)]);
    root.render(withAuth(<BrowserRouter><Header /></BrowserRouter>, ADMIN));
    await tick();
    findButton(container, 'Cerrar Sesión').click();
    await tick();
    expect(localStorage.getItem('pieca_token')).toBeNull();
    expect(container.textContent).toContain('Registrarse');
  });

  it('el botón hamburguesa abre y cierra el menú', async () => {
    mock = mockFetch([]);
    root.render(withAuth(<BrowserRouter><Header /></BrowserRouter>, null));
    await tick();
    const burger = container.querySelector('.pieca-burger');
    const menu = container.querySelector('.pieca-menu');
    expect(menu.classList.contains('is-open')).toBe(false);
    burger.click();
    await tick();
    expect(container.querySelector('.pieca-menu').classList.contains('is-open')).toBe(true);
    container.querySelector('.pieca-burger').click();
    await tick();
    expect(container.querySelector('.pieca-menu').classList.contains('is-open')).toBe(false);
  });
});