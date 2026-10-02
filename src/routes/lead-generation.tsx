import { createFileRoute } from "@tanstack/react-router";
import { DirectionPage } from "@/components/agency/DirectionPage";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/lead-generation")({
  head: () => agencyHead("leads"),
  component: () => <DirectionPage direction="leads" />,
});
