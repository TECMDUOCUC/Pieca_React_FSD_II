import { getCart, addToCart, setQuantity, clearCart } from './cart';

describe('cart.js', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('getCart devuelve [] sin datos o con JSON corrupto', () => {
    expect(getCart()).toEqual([]);
    localStorage.setItem('pieca_cart', 'not-json');
    expect(getCart()).toEqual([]);
  });

  it('addToCart agrega nuevo y acumula existente', () => {
    addToCart(1, 2);
    addToCart(1, 3);
    addToCart(2, 1);
    expect(getCart()).toEqual([{ id: 1, quantity: 5 }, { id: 2, quantity: 1 }]);
  });

  it('setQuantity a 0 elimina el item', () => {
    addToCart(1, 2);
    setQuantity(1, 0);
    expect(getCart()).toEqual([]);
  });

  it('clearCart vacía el almacenamiento', () => {
    addToCart(1, 1);
    clearCart();
    expect(localStorage.getItem('pieca_cart')).toBeNull();
  });
});