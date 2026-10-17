import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Admin from './Admin';
import rocksData from '../data/rocks.json';

describe('Pruebas de renderizado y lógica del Panel de Administración', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
    // Mock alert to prevent blocking tests
    spyOn(window, 'alert').and.callFake(() => {});
    // Mock confirm to automatically accept deletions in tests
    spyOn(window, 'confirm').and.returnValue(true);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    localStorage.clear();
  });

  it('debe renderizar el panel con las pestañas de navegación', async () => {
    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Panel de Administración');
    expect(container.querySelector('.btn-outline-light')).toBeTruthy(); // Tabs
    expect(container.textContent).toContain('Inventario');
    expect(container.textContent).toContain('Añadir Roca');
    expect(container.textContent).toContain('Usuarios');
    expect(container.textContent).toContain('Ventas');
  });

  it('debe mostrar la tabla de inventario por defecto', async () => {
    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('ID');
    expect(container.textContent).toContain('Nombre');
    expect(container.textContent).toContain(rocksData[0].name);
  });

  it('debe permitir añadir una nueva roca al inventario', async () => {
    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Switch to Add Rock tab
    const addTabBtn = Array.from(container.querySelectorAll('.btn')).find(btn => btn.textContent === 'Añadir Roca');
    addTabBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Fill form
    const inputs = container.querySelectorAll('input');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;

    // Map inputs to fields based on placeholder or order
    // Name, Price, Shipping, Weight, Height, Width, Length, Volume, Imgdir
    const setVal = (index, val) => {
      nativeInputValueSetter.call(inputs[index], val);
      inputs[index].dispatchEvent(new Event('input', { bubbles: true }));
    };

    setVal(0, 'Roca de Prueba');
    setVal(1, '5000');
    setVal(2, '1000');
    setVal(3, '200');
    setVal(4, '10');
    setVal(5, '10');
    setVal(6, '10');
    setVal(7, '1000');
    setVal(8, 'assets/1.png');

    const form = container.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(window.alert).toHaveBeenCalledWith('¡Roca guardada exitosamente!');
    
    // Verify it's in localStorage
    const customRocks = JSON.parse(localStorage.getItem('pieca_custom_rocks'));
    expect(customRocks.length).toBe(1);
    expect(customRocks[0].name).toBe('Roca de Prueba');
  });

  it('debe eliminar una roca del inventario', async () => {
    // First, add a rock so we have something to delete
    const customRock = { name: 'Roca a Borrar', price: 100, 'shipping-fee': 0, weight: 1, height: 1, width: 1, length: 1, volume: 1, imgdir: '' };
    localStorage.setItem('pieca_custom_rocks', JSON.stringify([customRock]));

    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Find and click delete button for the custom rock
    const deleteBtns = container.querySelectorAll('.btn-danger');
    // The custom rock should be at the end of the list
    if (deleteBtns.length > 0) {
      // Click the last delete button (our custom rock)
      deleteBtns[deleteBtns.length - 1].click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify it's removed from localStorage
      const customRocks = JSON.parse(localStorage.getItem('pieca_custom_rocks'));
      expect(customRocks.length).toBe(0);
      
      // Verify it's added to deleted names if it was a default rock, 
      // but since it was custom, it should just be gone from custom list.
    }
  });

  it('debe mostrar la tabla de usuarios al cambiar de pestaña', async () => {
    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Switch to Users tab
    const usersTabBtn = Array.from(container.querySelectorAll('.btn')).find(btn => btn.textContent === 'Usuarios');
    usersTabBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('Carlos Mendoza Silva');
    expect(container.textContent).toContain('Administrador');
  });

  it('debe mostrar la tabla de ventas al cambiar de pestaña', async () => {
    root.render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Switch to Sales tab
    const salesTabBtn = Array.from(container.querySelectorAll('.btn')).find(btn => btn.textContent === 'Ventas');
    salesTabBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.textContent).toContain('BOL-10492');
    expect(container.textContent).toContain('Completado');
  });
});