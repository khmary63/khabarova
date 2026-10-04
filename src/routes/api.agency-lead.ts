import { createFileRoute } from "@tanstack/react-router";
import { agencyLeadSchema } from "@/lib/agency-lead-schema";
import { deliverAgencyLead } from "@/lib/agency-crm.server";
const failure =
  "Не удалось подтвердить отправку. Пожалуйста, свяжитесь с нами через ИИ-консультанта или по телефону.";
export const Route = createFileRoute("/api/agency-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin)
          return Response.json(
            { ok: false, message: "Отправьте заявку с сайта." },
            { status: 403 },
          );
        if (!request.headers.get("content-type")?.includes("application/json"))
          return Response.json({ ok: false, message: "Неверный формат заявки." }, { status: 415 });
        const body = await request.text();
        if (body.length > 10000)
          return Response.json({ ok: false, message: "Слишком длинная заявка." }, { status: 413 });
        let input: unknown;
        try {
          input = JSON.parse(body);
        } catch {
          return Response.json({ ok: false, message: "Проверьте данные заявки." }, { status: 400 });
        }
        const parsed = agencyLeadSchema.safeParse(input);
        if (!parsed.success)
          return Response.json(
            { ok: false, message: "Проверьте имя, телефон и согласие на обработку данных." },
            { status: 400 },
          );
        try {
          await deliverAgencyLead(parsed.data);
          return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
        } catch (error) {
          console.error("[agency-lead]", error instanceof Error ? error.message : "delivery_error");
          return Response.json(
            { ok: false, message: failure },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});
