import {
  getStoredCustomRocks,
  getDeletedRockNames,
  saveCustomRocks,
  saveDeletedRockNames
} from './adminData';

describe('adminData.js', () => {
  beforeEach(() => localStorage.clear());

  it('getStoredCustomRocks devuelve [] cuando no hay nada', () => {
    expect(getStoredCustomRocks()).toEqual([]);
  });
  it('getStoredCustomRocks devuelve [] con JSON corrupto', () => {
    localStorage.setItem('pieca_custom_rocks', 'not-json');
    expect(getStoredCustomRocks()).toEqual([]);
  });
  it('saveCustomRocks + getStoredCustomRocks round-trip', () => {
    saveCustomRocks([{ name: 'A' }]);
    expect(getStoredCustomRocks()).toEqual([{ name: 'A' }]);
  });
  it('getDeletedRockNames devuelve [] con JSON corrupto', () => {
    localStorage.setItem('pieca_deleted_rocks', 'not-json');
    expect(getDeletedRockNames()).toEqual([]);
  });
  it('saveDeletedRockNames + getDeletedRockNames round-trip', () => {
    saveDeletedRockNames(['X', 'Y']);
    expect(getDeletedRockNames()).toEqual(['X', 'Y']);
  });
});