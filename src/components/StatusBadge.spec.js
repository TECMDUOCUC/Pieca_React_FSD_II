import React from 'react';
import { createRoot } from 'react-dom/client';
import StatusBadge, { STATUS_OPTIONS } from './StatusBadge';
import { tick } from '../test/helpers';

describe('StatusBadge.jsx', () => {
  let container, root;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { root.unmount(); container.remove(); });

  it('traduce cada estado al español', async () => {
    const cases = [
      ['PROCESSING', 'Procesando'], ['SHIPPING', 'En envío'],
      ['DELIVERED', 'Entregado'], ['CANCELLED', 'Cancelado'], ['FAILED', 'Fallido'],
    ];
    for (const [status, label] of cases) {
      root.render(<StatusBadge status={status} />);
      await tick(20);
      expect(container.textContent).toContain(label);
    }
  });

  it('estado desconocido no rompe', async () => {
    root.render(<StatusBadge status="WEIRD" />);
    await tick();
    expect(container.textContent).toContain('WEIRD');
  });

  it('STATUS_OPTIONS expone los 5 estados para el select del seller', () => {
    expect(STATUS_OPTIONS.length).toBe(5);
    expect(STATUS_OPTIONS.map(o => o.value)).toContain('SHIPPING');
  });
});