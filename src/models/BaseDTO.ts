export function tt(t: (key: string, ...args: any[]) => string, key: string, fallback: string) {
  const result = t(key);
  return result === key ? fallback : result;
}

export function generateI18nHeaders<T>(
  t: (key: string, ...args: any[]) => string,
  fields: { key: keyof T; fallback: string }[]
) {
  return fields.map((f) => ({
    key: f.key as string,
    title: tt(t, `table.${String(f.key)}`, f.fallback),
  }));
}
