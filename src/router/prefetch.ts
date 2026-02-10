import { ROUTES } from "@/lib/constants";

type PrefetchMap = Record<string, () => Promise<unknown>>;

const prefetchers: PrefetchMap = {
  [ROUTES.ARBITROS]: () => import("@/features/marketplace/pages/ArbitrosListPage"),
  [ROUTES.LOGIN]: () => import("@/features/auth/pages/LoginPage"),
};

export function prefetchRoute(path: string) {
  const fn = prefetchers[path];
  if (fn) {
    fn();
  }
}
