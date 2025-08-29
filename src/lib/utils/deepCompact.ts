/**
 * Recursively removes empty, null, undefined values and empty arrays/objects
 * Preserves numbers (including 0) and booleans
 */
export function deepCompact(value: any): any {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    const compacted = value
      .map(item => deepCompact(item))
      .filter(item => item !== undefined);
    return compacted.length === 0 ? undefined : compacted;
  }

  if (typeof value === 'object') {
    const compacted: any = {};
    let hasValidKeys = false;

    for (const [key, val] of Object.entries(value)) {
      const compactedVal = deepCompact(val);
      if (compactedVal !== undefined) {
        compacted[key] = compactedVal;
        hasValidKeys = true;
      }
    }

    return hasValidKeys ? compacted : undefined;
  }

  return value;
}
