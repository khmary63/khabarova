import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitLeadMagnet } from "@/lib/blog.functions";

type Props = {
  slug: string;
  title: string;
  description?: string | null;
  buttonLabel?: string | null;
};

export function LeadMagnetForm({ slug, title, description, buttonLabel }: Props) {
  const submit = useServerFn(submitLeadMagnet);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("lead-magnet.pdf");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 1) {
      toast.error("Введите имя");
      return;
    }
    if (phone.trim().length < 3) {
      toast.error("Введите телефон");
      return;
    }
    if (!consent) {
      toast.error("Подтвердите согласие на обработку данных");
      return;
    }
    setLoading(true);
    try {
      const res = await submit({ data: { slug, name: name.trim(), phone: phone.trim(), consent: true } });
      if (!res.ok) {
        toast.error(res.error || "Не удалось отправить");
        return;
      }
      setDownloadUrl(res.url);
      setFilename(res.filename);
      toast.success("Готово! Файл доступен для скачивания.");
      try {
        (window as unknown as { ym?: (id: number, action: string, goal: string) => void }).ym?.(
          107882480,
          "reachGoal",
          "lead_magnet_submit",
        );
      } catch {
        // ignore
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 md:p-8">
      <div className="text-xs uppercase tracking-widest text-primary">Бесплатно</div>
      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h3>
      {description && (
        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}

      {downloadUrl ? (
        <div className="mt-6 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 text-success">
            <Check className="h-5 w-5" strokeWidth={2} />
            <span className="text-sm font-medium">Спасибо! Файл готов.</span>
          </div>
          <a
            href={downloadUrl}
            download={filename}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Скачать
          </a>
          <p className="text-xs text-muted-foreground">
            Ссылка действует 10 минут. Если что — заполните форму ещё раз.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2" noValidate>
          <input
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="tel"
            required
            maxLength={50}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 ___ ___ __ __"
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <label className="sm:col-span-2 flex items-start gap-3 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span>
              Даю{" "}
              <a href="/consent" target="_blank" rel="noreferrer" className="underline hover:text-primary">
                согласие на обработку персональных данных
              </a>{" "}
              и ознакомлен(а) с{" "}
              <a href="/privacy" target="_blank" rel="noreferrer" className="underline hover:text-primary">
                политикой конфиденциальности
              </a>
              .
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Download className="h-4 w-4" strokeWidth={2} />
                {buttonLabel?.trim() || "Скачать"}
              </>
            )}
          </button>
        </form>
      )}
    </aside>
  );
}
