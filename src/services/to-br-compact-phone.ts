export function toBRCompactPhone(raw: string, fallbackAreaCode?: string): string {
  let d = String(raw).replace(/\D/g, '');

  d = d.replace(/^00/, '');
  d = d.replace(/^\+?/, '');

  if (d.startsWith('55')) d = d.slice(2);

  d = d.replace(/^0\d{2}/, '');

  if (d.length === 11 || d.length === 10) {
  } else if ((d.length === 9 || d.length === 8) && fallbackAreaCode) {
    if (!/^\d{2}$/.test(fallbackAreaCode)) {
      throw new Error('fallbackAreaCode deve ter 2 dígitos (ex.: "12").');
    }
    d = fallbackAreaCode + d;
  } else if (d.length > 11) {
    d = d.slice(-11);
  } else {
    throw new Error('Número inválido ou sem DDD. Forneça fallbackAreaCode.');
  }

  const area = d.slice(0, 2);
  const subscriber = d.slice(2);
  if (!/^\d{2}$/.test(area) || !/^\d{8,9}$/.test(subscriber)) {
    throw new Error('Formato inválido após normalização.');
  }

  return `55${area}${subscriber}`;
}
