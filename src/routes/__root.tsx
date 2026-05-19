import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { getSiteSettings } from "@/lib/site-settings.functions";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { Toaster } from "sonner";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getSiteSettings(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "НейроМаркет — ИИ-сотрудники в продажи | Мария Хабарова" },
      {
        name: "description",
        content:
          "НейроМаркет — внедрение ИИ-сотрудников в отделы продаж. Эксперт Мария Хабарова. Первый результат за 7 дней.",
      },
      { name: "author", content: "Мария Хабарова" },
      { property: "og:site_name", content: "НейроМаркет" },
      { property: "og:title", content: "НейроМаркет — ИИ-сотрудники в продажи" },
      {
        property: "og:description",
        content:
          "Внедряем ИИ-сотрудников в отделы продаж. Кейсы, методология, бесплатный ИИ-аудит за 15 минут.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "cMNxxtMhitwNVAwwywctoyLUfZHOjXskqzV7MSlgkLc" },
      // Регион сайта — Самара (для Яндекс.Вебмастера и геопоиска)
      { name: "geo.region", content: "RU-SAM" },
      { name: "geo.placename", content: "Самара" },
      { name: "geo.position", content: "53.195873;50.100193" },
      { name: "ICBM", content: "53.195873, 50.100193" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      // Preconnect to third-party origins for analytics/chat widgets — speeds up first request
      { rel: "preconnect", href: "https://mc.yandex.ru", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://mytopf.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://eureca-ai.web.app", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://w2097894.yclients.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://mc.yandex.ru" },
      { rel: "dns-prefetch", href: "https://mytopf.com" },
      { rel: "dns-prefetch", href: "https://w2097894.yclients.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* Eureka chat widget */}
        {(() => {
          const EurekaWidget = "eureka-chat-widget" as unknown as React.ElementType;
          return (
            <EurekaWidget
              api-key="3fee383b-00bc-483a-a056-84a73212d830"
              lang="ru"
              open-by-window-message="true"
            />
          );
        })()}
        <script
          type="module"
          crossOrigin=""
          src="https://eureca-ai.web.app/widget.js?t=1779020584328"
        />
        {/* Yandex.Metrika counter */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(107882480,"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/107882480" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        {/* mytopf.com / VK Ads counter */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var _tmr=window._tmr||(window._tmr=[]);_tmr.push({id:"3766746",type:"pageView",start:(new Date()).getTime()});(function(d,w,id){if(d.getElementById(id))return;var ts=d.createElement("script");ts.type="text/javascript";ts.async=true;ts.id=id;ts.src="https://mytopf.com/js/code.js";var f=function(){var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(ts,s);};if(w.opera=="[object Opera]"){d.addEventListener("DOMContentLoaded",f,false);}else{f();}})(document,window,"tmr-code");`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mytopf.com/counter?id=3766746;js=na" style={{ position: "absolute", left: "-9999px" }} alt="mytopf.com" />
          </div>
        </noscript>

        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <AnalyticsTracker />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
