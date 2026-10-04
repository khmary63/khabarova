import { createFileRoute, redirect } from "@tanstack/react-router";

// The old SMB landing is retired: permanent redirect to the main page.
export const Route = createFileRoute("/msb")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
