export const randrangeGaussInverted = (min: number, max?: number, nCalls = 3) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  let i = nCalls;
  let result = 0;
  while (i--) result += Math.random();
  const normalized = result / nCalls;
  const inversed = (normalized + 0.5) % 1;
  return inversed * (max - min) + min;
};
