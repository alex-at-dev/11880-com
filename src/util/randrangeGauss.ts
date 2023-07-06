export const randrangeGauss = (min: number, max?: number, nCalls = 3) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  let i = nCalls;
  let result = 0;
  while (i--) result += Math.random();
  return (result / nCalls) * (max - min) + min;
};
