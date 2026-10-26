import { isValidDomain, validateRUT } from '../lib/validation';

describe('validation.js', () => {
  describe('isValidDomain', () => {
    it('acepta @duoc.cl', () => expect(isValidDomain('a@duoc.cl')).toBe(true));
    it('acepta @profesor.duoc.cl', () => expect(isValidDomain('a@profesor.duoc.cl')).toBe(true));
    it('acepta @gmail.com', () => expect(isValidDomain('a@gmail.com')).toBe(true));
    it('normaliza mayúsculas y espacios', () => expect(isValidDomain('  A@DUOC.CL ')).toBe(true));
    it('rechaza dominios ajenos', () => expect(isValidDomain('a@bad.com')).toBe(false));
  });

  describe('validateRUT', () => {
    it('acepta RUT con DV numérico', () => expect(validateRUT('12.345.678-5')).toBe(true));
    it('acepta RUT con DV K', () => expect(validateRUT('12.345.670-K')).toBe(true));
    it('acepta RUT con DV 0', () => expect(validateRUT('12.345.675-0')).toBe(true));
    it('acepta RUT sin formato', () => expect(validateRUT('123456785')).toBe(true));
    it('rechaza cuerpos demasiado cortos', () => expect(validateRUT('123')).toBe(false));
    it('rechaza cuerpos con letras', () => expect(validateRUT('ABC12345-5')).toBe(false));
    it('rechaza DV incorrecto', () => expect(validateRUT('12.345.678-9')).toBe(false));
  });
});