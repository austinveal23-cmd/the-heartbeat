/** Good enough for locally-generated alarm/battle ids; not cryptographically unique. */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
