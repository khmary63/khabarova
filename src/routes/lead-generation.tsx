import { createFileRoute } from "@tanstack/react-router";
import { MultiLanding } from "@/components/agency/MultiLanding";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/lead-generation")({
  head: () => agencyHead("leads"),
  component: () => <MultiLanding direction="leads" />,
});
