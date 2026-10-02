import { createFileRoute } from "@tanstack/react-router";
import { DirectionPage } from "@/components/agency/DirectionPage";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/automation")({
  head: () => agencyHead("automation"),
  component: () => <DirectionPage direction="automation" />,
});
