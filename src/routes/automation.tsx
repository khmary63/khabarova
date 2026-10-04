import { createFileRoute } from "@tanstack/react-router";
import { MultiLanding } from "@/components/agency/MultiLanding";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/automation")({
  head: () => agencyHead("automation"),
  component: () => <MultiLanding direction="automation" />,
});
