import { Color } from '../types/Color';

export const getColorDiff = (c1: Color, c2: Color): Color => ({
  r: c2.r - c1.r,
  g: c2.g - c1.g,
  b: c2.b - c1.b,
  a: c2.a - c1.a,
});
