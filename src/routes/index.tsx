import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/nexus/dashboard";
import { pageHead } from "@/components/nexus/metadata";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Command Center",
      "Visão integrada da manutenção industrial: performance, ativos e insights preditivos.",
    ),
  component: Dashboard,
});
