// YClients API helpers — серверная сторона. Используют PARTNER_TOKEN.
// Документация: https://developers.yclients.com/ru/

const BASE = "https://api.yclients.com/api/v1";

function authHeaders() {
  const token = process.env.YCLIENTS_PARTNER_TOKEN;
  if (!token) throw new Error("YCLIENTS_PARTNER_TOKEN не настроен");
  return {
    Accept: "application/vnd.yclients.v2+json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function companyId(): string {
  const id = process.env.YCLIENTS_COMPANY_ID;
  if (!id) throw new Error("YCLIENTS_COMPANY_ID не настроен");
  return id;
}

async function yc<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...authHeaders(), ...(init?.headers ?? {}) } });
  const text = await res.text();
  let body: unknown;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    throw new Error(`YClients API ${res.status} ${path}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body as T;
}

type YCResp<T> = { success: boolean; data: T; meta?: unknown };

export type YcService = { id: number; title: string; price_min?: number; price_max?: number; duration?: number };
export type YcStaff = { id: number; name: string; specialization?: string };
export type YcDate = string; // ISO date YYYY-MM-DD
export type YcTime = { time: string; datetime: string }; // HH:MM and ISO

export async function listServices(): Promise<YcService[]> {
  const r = await yc<YCResp<{ services: YcService[] }>>(`/book_services/${companyId()}`);
  return r.data?.services ?? [];
}

export async function listStaff(serviceId?: number): Promise<YcStaff[]> {
  const qs = serviceId ? `?service_ids[]=${serviceId}` : "";
  const r = await yc<YCResp<YcStaff[]>>(`/book_staff/${companyId()}${qs}`);
  return Array.isArray(r.data) ? r.data : [];
}

export async function listDates(serviceId?: number, staffId?: number): Promise<YcDate[]> {
  const params = new URLSearchParams();
  if (serviceId) params.append("service_ids[]", String(serviceId));
  if (staffId) params.set("staff_id", String(staffId));
  const qs = params.toString() ? `?${params.toString()}` : "";
  const r = await yc<YCResp<{ booking_dates?: YcDate[] } | YcDate[]>>(`/book_dates/${companyId()}${qs}`);
  const d = r.data as { booking_dates?: YcDate[] } | YcDate[];
  if (Array.isArray(d)) return d;
  return d.booking_dates ?? [];
}

export async function listTimes(staffId: number, date: string, serviceId?: number): Promise<YcTime[]> {
  const qs = serviceId ? `?service_ids[]=${serviceId}` : "";
  const r = await yc<YCResp<YcTime[]>>(`/book_times/${companyId()}/${staffId}/${date}${qs}`);
  return Array.isArray(r.data) ? r.data : [];
}

export type BookInput = {
  phone: string;
  fullname: string;
  email?: string;
  comment?: string;
  serviceId: number;
  staffId: number;
  datetime: string; // ISO with TZ
};

export async function createBookRecord(input: BookInput): Promise<{ id: number; record_hash?: string }> {
  const body = {
    phone: input.phone.replace(/\D/g, ""),
    fullname: input.fullname,
    email: input.email ?? "",
    comment: input.comment ?? "",
    type: "mobile",
    notify_by_sms: 0,
    notify_by_email: 0,
    api_id: `lov-${Date.now()}`,
    appointments: [
      {
        id: 1,
        services: [input.serviceId],
        staff_id: input.staffId,
        datetime: input.datetime,
      },
    ],
  };
  const r = await yc<YCResp<Array<{ id: number; record_hash?: string }>>>(`/book_record/${companyId()}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const first = Array.isArray(r.data) ? r.data[0] : (r.data as unknown as { id: number });
  return first;
}

/** Подбирает первую услугу (или по env YCLIENTS_SERVICE_ID) и первого подходящего сотрудника */
export async function resolveServiceAndStaff(): Promise<{ service: YcService; staff: YcStaff }> {
  const services = await listServices();
  if (services.length === 0) throw new Error("В YClients нет услуг для онлайн-записи");
  const envServiceId = process.env.YCLIENTS_SERVICE_ID ? Number(process.env.YCLIENTS_SERVICE_ID) : null;
  const service = (envServiceId && services.find((s) => s.id === envServiceId)) || services[0];

  const staffList = await listStaff(service.id);
  if (staffList.length === 0) throw new Error("Нет сотрудников, оказывающих эту услугу");
  return { service, staff: staffList[0] };
}

/** Возвращает ближайшие N свободных слотов в виде [{datetime, date, time, staffId}] */
export async function getUpcomingSlots(limit = 6): Promise<Array<{ datetime: string; date: string; time: string; staffId: number; serviceId: number; serviceTitle: string }>> {
  const { service, staff } = await resolveServiceAndStaff();
  const dates = await listDates(service.id, staff.id);
  const out: Array<{ datetime: string; date: string; time: string; staffId: number; serviceId: number; serviceTitle: string }> = [];
  for (const date of dates.slice(0, 7)) {
    const times = await listTimes(staff.id, date, service.id);
    for (const t of times) {
      out.push({ datetime: t.datetime, date, time: t.time, staffId: staff.id, serviceId: service.id, serviceTitle: service.title });
      if (out.length >= limit) return out;
    }
  }
  return out;
}
