'use client';
export function Providers({ children }: { children: React.ReactNode }) {
  // SessionProvider removed for static site export (no backend)
  return <>{children}</>;
}
