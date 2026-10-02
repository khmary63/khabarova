import { createFileRoute } from "@tanstack/react-router";
import { DirectionPage } from "@/components/agency/DirectionPage";
import { agencyHead } from "@/lib/agency-seo";
export const Route = createFileRoute("/ai-creator")({
  head: () => agencyHead("creative"),
  component: () => <DirectionPage direction="creative" />,
});
