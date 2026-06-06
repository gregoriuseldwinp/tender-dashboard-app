export function hasPermission(permissions: string[], slug: string): boolean {
  return permissions.includes(slug)
}

export function hasAnyPermission(permissions: string[], slugs: string[]): boolean {
  return slugs.some(s => permissions.includes(s))
}

export function hasAllPermissions(permissions: string[], slugs: string[]): boolean {
  return slugs.every(s => permissions.includes(s))
}
