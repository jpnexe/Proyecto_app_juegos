export function sanitizeTextInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[&<>"'/]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return escapeMap[match] || match;
    })
    .trim()
    .slice(0, 30);
}
