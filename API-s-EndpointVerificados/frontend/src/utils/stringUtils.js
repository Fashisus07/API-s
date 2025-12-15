// Utilidades simples para manipular strings (normalizar, slugify)
export function slugify(str) {
  if (!str) return '';
  return str
    .toString()
    .trim()
    // Normalizar acentos
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-') // espacios a guiones
    .replace(/[^a-z0-9\-]/g, '') // remover caracteres no alfanuméricos
    ;
}
