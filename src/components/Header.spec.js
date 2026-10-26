import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Header from './Header';

describe('Header.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
  });
  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
  });

  it('muestra Registrarse/Iniciar Sesión sin sesión', async () => {
    root.render(<BrowserRouter><Header /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    expect(container.textContent).toContain('Registrarse');
    expect(container.textContent).toContain('Iniciar Sesión');
    expect(container.textContent).not.toContain('Cerrar Sesión');
  });

  it('muestra Catálogo/Carrito/Admin/Cerrar Sesión con sesión', async () => {
    localStorage.setItem('pieca_user', JSON.stringify({ email: 'a@duoc.cl' }));
    root.render(<BrowserRouter><Header /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    expect(container.textContent).toContain('Catálogo');
    expect(container.textContent).toContain('Carrito');
    expect(container.textContent).toContain('Admin');
    expect(container.textContent).toContain('Cerrar Sesión');
  });

  it('handleLogout limpia la sesión', async () => {
    localStorage.setItem('pieca_user', JSON.stringify({ email: 'a@duoc.cl' }));
    root.render(<BrowserRouter><Header /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const logoutBtn = Array.from(container.querySelectorAll('button'))
      .find(b => b.textContent.includes('Cerrar Sesión'));
    logoutBtn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(localStorage.getItem('pieca_user')).toBeNull();
    expect(container.textContent).toContain('Registrarse');
  });
});