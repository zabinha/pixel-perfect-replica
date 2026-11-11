import { createFileRoute } from "@tanstack/react-router";
import { OrdersView } from "@/components/nexus/views";
import { pageHead } from "@/components/nexus/metadata";
export const Route = createFileRoute("/ordens")({
  head: () =>
    pageHead(
      "Ordens de Serviço",
      "Gerencie ordens de manutenção, técnicos, prioridades e checklists no NexusCMMS.",
    ),
  component: OrdersView,
});
