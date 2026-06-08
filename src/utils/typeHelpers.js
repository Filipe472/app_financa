/**
 * Wrapper para garantir que boolean props sejam tipificadas corretamente
 * Isso ajuda a evitar problemas de tipo em iOS com React Native
 */

export const ensureBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return !!value;
};

export const ensureNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return Number(value);
};

export const ensureString = (value) => {
  if (typeof value === 'string') return value;
  return String(value);
};
