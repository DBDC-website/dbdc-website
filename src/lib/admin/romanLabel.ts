const ROMAN_LABEL_PATTERN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

/**
 * True when a label is blank or a plain Roman numeral, i.e. auto-generated
 * rather than typed by an editor. Reordering may overwrite these; anything
 * else is a deliberate label and must be preserved.
 */
export function isAutoRomanLabel(label: string | null | undefined): boolean {
  const trimmed = label?.trim() ?? '';
  if (trimmed === '') return true;
  return ROMAN_LABEL_PATTERN.test(trimmed.toUpperCase());
}

/** Convert 1-based position to a Roman numeral label (I, II, III, …). */
export function toRomanLabel(position: number): string {
  if (!Number.isFinite(position) || position < 1) return 'I';

  const numerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let remaining = Math.trunc(position);
  let result = '';

  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}
