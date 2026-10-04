import { createFileRoute, redirect } from "@tanstack/react-router";

// The old B2B landing is retired: permanent redirect to the main page.
export const Route = createFileRoute("/b2b")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
