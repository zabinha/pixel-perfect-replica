import { createFileRoute } from "@tanstack/react-router";
import { AssetsView } from "@/components/nexus/views";
import { pageHead } from "@/components/nexus/metadata";
export const Route = createFileRoute("/ativos")({
  head: () =>
    pageHead(
      "Ativos & Telemetria IoT",
      "Monitore equipamentos industriais, saúde e sensores de temperatura e vibração.",
    ),
  component: AssetsView,
});
