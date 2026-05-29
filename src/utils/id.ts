/** React Native 上で crypto 依存なしに使える一意 ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
