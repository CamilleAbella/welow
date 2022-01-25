export function groupBy<T, K extends keyof T & string>(
  list: T[],
  prop: K
): Map<T[K], T[]> {
  const groups = new Map<T[K], T[]>()

  list.forEach((item) => {
    const value = item[prop]

    if (groups.has(value)) groups.get(value)?.push(item)
    else groups.set(value, [item])
  })

  return groups
}
