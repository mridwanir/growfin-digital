export type Serializable<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? Array<Serializable<U>>
    : T extends object
      ? { [K in keyof T]: Serializable<T[K]> }
      : T

/**
 * Recursively serializes database records and nested values into plain serializable DTOs,
 * converting Date instances to ISO strings across Server Component to Client Component boundaries.
 */
export function serializeRecord<T>(data: T): Serializable<T> {
  if (data === null || data === undefined) {
    return data as Serializable<T>
  }
  if (data instanceof Date) {
    return data.toISOString() as Serializable<T>
  }
  if (Array.isArray(data)) {
    return data.map(item => serializeRecord(item)) as Serializable<T>
  }
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeRecord(value)
    }
    return result as Serializable<T>
  }
  return data as Serializable<T>
}
