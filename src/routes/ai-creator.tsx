import { createFileRoute } from "@tanstack/react-router";
import { MultiLanding } from "@/components/agency/MultiLanding";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/ai-creator")({
  head: () => agencyHead("creative"),
  component: () => <MultiLanding direction="creative" />,
});
