import { createFileRoute } from "@tanstack/react-router";
import { AgencyPage } from "@/components/agency/AgencyPage";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/")({ head: () => agencyHead(), component: AgencyPage });
