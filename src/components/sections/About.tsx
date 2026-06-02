import mariaAbout from "@/assets/maria-about.jpg";
import { SITE } from "@/lib/site";

const FACTS = [
  { v: "20+", l: "внедрений ИИ-автоматизации" },
  { v: "14 дней", l: "до первого измеримого результата" },
  { v: "Самара + РФ", l: "работаем дистанционно по всей стране" },
];

export function About() {
  return (
    <section id="about" className="border-b border-border py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative">
          <div className="aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-surface">
            <img
              src={mariaAbout}
              alt={`${SITE.expert} в работе — основатель ${SITE.brand}`}
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">О Марии</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            «Помогаю владельцам бизнеса перестать терять заявки —<br />
            с помощью ИИ-сотрудников и понятной методологии»
          </h2>
          <div className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground space-y-4">
            <p>
              Меня зовут Мария Хабарова. Более 6 лет в IT-консалтинге: прошла путь от администратора до руководителя IT-проектов по внедрению логистических систем, системы управления производством и биллинговой системы в Москве.
            </p>
            <p>
              Сейчас — руководитель отдела внедрения ИИ ООО "АТОМ" (известный бренд в сфере интернет-маркетинга, резиденты Skolkovo), ведущий бизнес-аналитик проектного офиса БАРС Груп (ТОП-100 российских IT-компаний, ТОП-10 ключевых игроков госсектора), партнер проекта "Neuroagents", основатель агентства ИИ-решений "Нейромаркет", вайбкодер, маркетолог.
            </p>
            <p>
              Внедряю ИИ-автоматизацию в продажи малого и среднего бизнеса. Не «бот для галочки», а полноценный ИИ-сотрудник, который встроен в воронку и приносит измеримые деньги уже в первый месяц.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.l} className="rounded-xl border border-border bg-surface p-4">
                <div className="num font-display text-2xl font-semibold tracking-tight text-primary">{f.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{f.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-xs font-semibold tracking-tight text-primary">
              НМ
            </div>
            <div className="text-sm">
              <div className="font-medium">{SITE.brand}</div>
              <div className="text-xs text-muted-foreground">Основатель и руководитель</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
