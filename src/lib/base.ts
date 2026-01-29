function normalizeBase(baseUrl: string): string {
  // Astro provides BASE_URL like "/SRP_demo_mobile/" for project pages.
  // We keep the trailing slash for safe concatenation.
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function withBase(path: string): string {
  const base = normalizeBase(import.meta.env.BASE_URL);
  if (path === '/' || path === '') return base;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}

export function stripBase(pathname: string): string {
  const base = normalizeBase(import.meta.env.BASE_URL);
  const baseNoTrailing = base.endsWith('/') ? base.slice(0, -1) : base;

  if (pathname === baseNoTrailing) return '/';
  if (pathname.startsWith(base)) return `/${pathname.slice(base.length)}`;
  return pathname;
}
