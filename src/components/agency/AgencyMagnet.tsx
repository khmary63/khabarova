import { AgencyQuickForm } from "./AgencyQuickForm";

/** Free checklist in exchange for a contact — for visitors who are not ready for a call. */
export function AgencyMagnet() {
  return (
    <AgencyQuickForm
      magnet
      direction="automation"
      id="checklist-form"
      title="Чек-лист: что в вашем бизнесе можно отдать ИИ"
      text="10 вопросов, по которым за 5 минут видно, где автоматизация сэкономит время. Оставьте имя и телефон — чек-лист откроется сразу после отправки."
    />
  );
}
