import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Register from './Register';

describe('Pruebas de renderizado y lógica de Registro', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
    // Mock alert to prevent blocking tests
    spyOn(window, 'alert').and.callFake(() => {});
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
  });

  it('debe renderizar el formulario de registro con todos los campos', async () => {
    root.render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Regístrese');
    expect(container.querySelector('#name')).toBeTruthy();
    expect(container.querySelector('#rut')).toBeTruthy();
    expect(container.querySelector('#email')).toBeTruthy();
    expect(container.querySelector('#password')).toBeTruthy();
  });

  it('debe mostrar error si el RUT no es válido', async () => {
    root.render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const form = container.querySelector('form');
    const inputs = form.querySelectorAll('input');
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;

    nativeInputValueSetter.call(inputs[0], 'Test User');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[1], '123'); // Invalid RUT
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[2], 'test@gmail.com');
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[3], 'password123');
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('El RUT ingresado no es válido.');
  });

  it('debe mostrar error si el dominio del correo no es permitido', async () => {
    root.render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const form = container.querySelector('form');
    const inputs = form.querySelectorAll('input');
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;

    nativeInputValueSetter.call(inputs[0], 'Test User');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

    // Use a VALID RUT here so the code passes RUT validation and checks Email
    // 12.345.678-5 is valid for body 12345678
    nativeInputValueSetter.call(inputs[1], '12.345.678-5'); 
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[2], 'test@bad.com');
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[3], 'password123');
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Solo se permiten correos de @duoc.cl');
  });

  it('debe registrar el usuario correctamente con datos válidos', async () => {
    root.render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const form = container.querySelector('form');
    const inputs = form.querySelectorAll('input');
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;

    nativeInputValueSetter.call(inputs[0], 'Juan Perez');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

    // Valid RUT
    nativeInputValueSetter.call(inputs[1], '12.345.678-5'); 
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[2], 'juan@duoc.cl');
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));

    nativeInputValueSetter.call(inputs[3], 'secret');
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Wait longer for alert and navigate simulation
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(localStorage.getItem('pieca_user')).toBeTruthy();
    const user = JSON.parse(localStorage.getItem('pieca_user'));
    expect(user.name).toBe('Juan Perez');
    expect(user.rut).toBe('12.345.678-5');
  });

  it('debe mostrar error si el cuerpo del RUT tiene letras', async () => {
    root.render(<BrowserRouter><Register /></BrowserRouter>);
    await new Promise(r => setTimeout(r, 50));
    const form = container.querySelector('form');
    const inputs = form.querySelectorAll('input');
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    const setVal = (i, v) => {
      setter.call(inputs[i], v);
      inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
    };
    setVal(0, 'Test');
    setVal(1, 'ABC12345-5');
    setVal(2, 'test@duoc.cl');
    setVal(3, 'pwd');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 50));
    expect(container.textContent).toContain('El RUT ingresado no es válido.');
  });
});