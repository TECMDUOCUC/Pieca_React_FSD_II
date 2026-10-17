import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Login from './Login';

describe('Pruebas de renderizado y lógica de Login', () => {
  let container;
  let root;

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

  it('debe renderizar el formulario de inicio de sesión', async () => {
    root.render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Inicie Sesión');
    expect(container.querySelector('#email')).toBeTruthy();
    expect(container.querySelector('#password')).toBeTruthy();
    expect(container.textContent).toContain('Iniciar Sesión');
  });

  it('debe mostrar error si el dominio del correo no es permitido', async () => {
    root.render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const emailInput = container.querySelector('#email');
    const passwordInput = container.querySelector('#password');
    const form = container.querySelector('form');

    // Simulate typing invalid email
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    
    nativeInputValueSetter.call(emailInput, 'test@invalid.com');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    nativeInputValueSetter.call(passwordInput, '123456');
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Solo se permiten correos de @duoc.cl');
  });

  it('debe guardar el usuario en localStorage al iniciar sesión exitosamente', async () => {
    root.render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const emailInput = container.querySelector('#email');
    const passwordInput = container.querySelector('#password');
    const form = container.querySelector('form');

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    
    nativeInputValueSetter.call(emailInput, 'student@duoc.cl');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    nativeInputValueSetter.call(passwordInput, 'securepass');
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(localStorage.getItem('pieca_user')).toBeTruthy();
    const user = JSON.parse(localStorage.getItem('pieca_user'));
    expect(user.email).toBe('student@duoc.cl');
  });
});