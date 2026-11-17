import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import Login from './Login';
import { mockFetch, cleanStorage, tick, setInput, findButton } from '../test/helpers';
import { AuthProvider } from '../lib/auth.jsx';

describe('Login.jsx (JWT real)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const render = () => root.render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>PANTALLA HOME</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>);

  const fillAndSubmit = async (email, password) => {
    setInput(container.querySelector('#email'), email);
    setInput(container.querySelector('#password'), password);
    container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick(80);
  };

  it('renderiza el formulario', async () => {
    mock = mockFetch([]);
    render();
    await tick();
    expect(container.textContent).toContain('Inicie Sesión');
    expect(container.querySelector('#email')).toBeTruthy();
    expect(container.querySelector('#password')).toBeTruthy();
  });

  it('login exitoso guarda el token JWT y navega a home', async () => {
    mock = mockFetch([{
      match: '/api/auth/login', method: 'POST',
      body: { token: 'jwt-falso-123', name: 'Admin', email: 'admin@pieca.cl', role: 'ROLE_ADMIN' },
    }]);
    render();
    await tick();
    await fillAndSubmit('admin@pieca.cl', 'admin123');
    expect(localStorage.getItem('pieca_token')).toBe('jwt-falso-123');
    expect(container.textContent).toContain('PANTALLA HOME');
    const post = mock.calls.find(c => c.path === '/api/auth/login');
    expect(JSON.parse(post.options.body)).toEqual({ email: 'admin@pieca.cl', password: 'admin123' });
  });

  it('credenciales inválidas (401) muestra el error y NO guarda token', async () => {
    mock = mockFetch([{ match: '/api/auth/login', method: 'POST', status: 401, body: { message: 'Credenciales inválidas' } }]);
    render();
    await tick();
    await fillAndSubmit('admin@pieca.cl', 'wrong');
    expect(container.textContent).toContain('Credenciales inválidas');
    expect(localStorage.getItem('pieca_token')).toBeNull();
  });
});