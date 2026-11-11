import { createFileRoute } from "@tanstack/react-router";
import { PredictiveView } from "@/components/nexus/views";
import { pageHead } from "@/components/nexus/metadata";
export const Route = createFileRoute("/preditiva")({
  head: () =>
    pageHead(
      "Manutenção Preditiva IA",
      "Antecipe falhas com insights e recomendações de manutenção preditiva simulados.",
    ),
  component: PredictiveView,
});
