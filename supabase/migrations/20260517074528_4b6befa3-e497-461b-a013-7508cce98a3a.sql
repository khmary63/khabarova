
-- Таблица просмотров страниц
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views (path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Анон может записывать просмотры (с ограничениями по длине)
CREATE POLICY "Anyone can log a page view"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(path) >= 1 AND length(path) <= 500
  AND (referrer IS NULL OR length(referrer) <= 1000)
  AND (session_id IS NULL OR length(session_id) <= 100)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);

-- Таблица кликов по CTA-элементам
CREATE TABLE public.click_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  label TEXT NOT NULL,
  target TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_click_events_created_at ON public.click_events (created_at DESC);
CREATE INDEX idx_click_events_path ON public.click_events (path);
CREATE INDEX idx_click_events_label ON public.click_events (label);

ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a click"
ON public.click_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(path) >= 1 AND length(path) <= 500
  AND length(label) >= 1 AND length(label) <= 200
  AND (target IS NULL OR length(target) <= 500)
  AND (session_id IS NULL OR length(session_id) <= 100)
);
