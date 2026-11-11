import { describe, expect, it } from "vitest";
import { filterOrders, initialOrders, statuses } from "@/components/nexus/data";
describe("Work order rules", () => {
  it("filters critical priority independently", () => {
    expect(
      filterOrders(initialOrders, {
        search: "",
        priority: "Crítica",
        type: "",
        technician: "",
      }).map((o) => o.id),
    ).toEqual(["OS-2048"]);
  });
  it("combines maintenance type and technician filters", () => {
    expect(
      filterOrders(initialOrders, {
        search: "",
        priority: "",
        type: "Preventiva",
        technician: "Ana Souza",
      }).map((o) => o.id),
    ).toEqual(["OS-2047"]);
  });
  it("supports the four required workflow states", () => {
    expect(statuses).toEqual(["Triagem", "Agendada", "Em Execução", "Concluída"]);
  });
});
