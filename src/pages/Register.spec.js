import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import Register from './Register';
import { mockFetch, cleanStorage, tick, setInput } from '../test/helpers';
import { AuthProvider } from '../lib/auth.jsx';

describe('Register.jsx (registro real vía API)', () => {
  let container, root, mock;
  beforeEach(() => {
    cleanStorage();
    spyOn(window, 'alert').and.callFake(() => {});
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); mock?.restore(); cleanStorage(); });

  const render = () => root.render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div>PANTALLA HOME</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>);

  const fill = async ({ name = 'Juan Perez', rut = '12.345.678-5', email = 'juan@duoc.cl', password = 'secret', confirm = 'secret' } = {}) => {
    setInput(container.querySelector('#name'), name);
    setInput(container.querySelector('#rut'), rut);
    setInput(container.querySelector('#email'), email);
    setInput(container.querySelector('#password'), password);
    setInput(container.querySelector('#confirm'), confirm);
    container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick(80);
  };

  it('RUT inválido se rechaza en el cliente sin llamar a la API', async () => {
    mock = mockFetch([]);
    render();
    await tick();
    await fill({ rut: '123' });
    expect(container.textContent).toContain('El RUT ingresado no es válido.');
    expect(mock.calls.length).toBe(0);
  });

  it('dominio no permitido se rechaza en el cliente', async () => {
    mock = mockFetch([]);
    render();
    await tick();
    await fill({ email: 'test@bad.com' });
    expect(container.textContent).toContain('Solo se permiten correos de @duoc.cl');
  });

  it('contraseñas distintas se rechazan', async () => {
    mock = mockFetch([]);
    render();
    await tick();
    await fill({ confirm: 'otra' });
    expect(container.textContent).toContain('Las contraseñas no coinciden.');
  });

  it('registro exitoso envía el payload, guarda token y navega', async () => {
    mock = mockFetch([{
      match: '/api/auth/register', method: 'POST',
      body: { token: 'jwt-nuevo', name: 'Juan Perez', email: 'juan@duoc.cl', role: 'ROLE_CLIENT' },
    }]);
    render();
    await tick();
    await fill();
    const post = mock.calls.find(c => c.path === '/api/auth/register');
    expect(JSON.parse(post.options.body)).toEqual({
      name: 'Juan Perez', rut: '12.345.678-5', email: 'juan@duoc.cl', password: 'secret',
    });
    expect(localStorage.getItem('pieca_token')).toBe('jwt-nuevo');
    expect(window.alert).toHaveBeenCalledWith('¡Registro exitoso!');
    expect(container.textContent).toContain('PANTALLA HOME');
  });

  it('email duplicado en el backend muestra el error', async () => {
    mock = mockFetch([{ match: '/api/auth/register', method: 'POST', status: 400, body: { message: 'Ya existe una cuenta con ese email' } }]);
    render();
    await tick();
    await fill();
    expect(container.textContent).toContain('Ya existe una cuenta con ese email');
    expect(localStorage.getItem('pieca_token')).toBeNull();
  });
});