const KEY = 'pieca_cart';

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveCart(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addToCart(id, quantity = 1) {
  const cart = getCart();
  const entry = cart.find((i) => i.id === id);
  if (entry) entry.quantity += quantity;
  else cart.push({ id, quantity });
  saveCart(cart);
  return cart;
}

export function setQuantity(id, quantity) {
  const cart = getCart()
    .map((i) => (i.id === id ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(KEY);
}