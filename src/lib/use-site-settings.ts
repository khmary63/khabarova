import { useLoaderData } from "@tanstack/react-router";

/** Page visibility switches from /blog/admin ("Видимость страниц на сайте"). */
export function useSiteSettings() {
  const root = useLoaderData({ from: "__root__" }) as
    | { apps?: boolean; blog?: boolean; reviews?: boolean }
    | undefined;
  return {
    apps: root?.apps ?? true,
    blog: root?.blog ?? true,
    reviews: root?.reviews ?? true,
  };
}
