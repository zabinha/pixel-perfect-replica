export type OrderStatus = "Triagem" | "Agendada" | "Em Execução" | "Concluída";
export type Order = {
  id: string;
  title: string;
  asset: string;
  priority: string;
  type: string;
  technician: string;
  status: OrderStatus;
  tasks: boolean[];
  logs: string[];
};
export const statuses: OrderStatus[] = ["Triagem", "Agendada", "Em Execução", "Concluída"];
export const assets = [
  {
    id: "CNC-001",
    name: "Torno CNC DMG Mori",
    sector: "Usinagem",
    status: "Operando",
    health: 96,
    temp: 42.5,
    vibration: 1.2,
    hours: 2840,
    review: 72,
  },
  {
    id: "CMP-002",
    name: "Compressor Atlas Copco",
    sector: "Utilidades",
    status: "Parada Crítica",
    health: 28,
    temp: 86.2,
    vibration: 8.4,
    hours: 6218,
    review: 94,
  },
  {
    id: "ROB-003",
    name: "Braço Robótico ABB",
    sector: "Montagem",
    status: "Operando",
    health: 98,
    temp: 38.1,
    vibration: 0.8,
    hours: 1920,
    review: 42,
  },
  {
    id: "GER-004",
    name: "Gerador Caterpillar",
    sector: "Utilidades",
    status: "Em Manutenção",
    health: 65,
    temp: 54.8,
    vibration: 2.6,
    hours: 4320,
    review: 87,
  },
  {
    id: "EST-005",
    name: "Esteira Transportadora",
    sector: "Montagem",
    status: "Operando",
    health: 91,
    temp: 35.6,
    vibration: 1.4,
    hours: 3650,
    review: 56,
  },
  {
    id: "PRS-006",
    name: "Prensa Hidráulica",
    sector: "Usinagem",
    status: "Operando",
    health: 88,
    temp: 48.2,
    vibration: 1.9,
    hours: 2180,
    review: 61,
  },
];
export const initialOrders: Order[] = [
  {
    id: "OS-2048",
    title: "Falha no rolamento do compressor",
    asset: "CMP-002",
    priority: "Crítica",
    type: "Corretiva",
    technician: "Carlos Silva",
    status: "Em Execução",
    tasks: [true, false, false],
    logs: ["20:32 · Carlos Silva iniciou a execução.", "20:15 · Anomalia de vibração detectada."],
  },
  {
    id: "OS-2047",
    title: "Lubrificação do eixo principal",
    asset: "CNC-001",
    priority: "Média",
    type: "Preventiva",
    technician: "Ana Souza",
    status: "Agendada",
    tasks: [false, false, false],
    logs: ["19:40 · Ordem agendada para amanhã."],
  },
  {
    id: "OS-2046",
    title: "Inspeção do sistema de arrefecimento",
    asset: "GER-004",
    priority: "Alta",
    type: "Preventiva",
    technician: "Pedro Santos",
    status: "Em Execução",
    tasks: [true, true, false],
    logs: ["18:20 · Inspeção inicial concluída."],
  },
  {
    id: "OS-2045",
    title: "Calibração de sensores de posição",
    asset: "ROB-003",
    priority: "Baixa",
    type: "Preditiva",
    technician: "Ana Souza",
    status: "Triagem",
    tasks: [false, false, false],
    logs: ["17:50 · Ordem criada pela análise preditiva."],
  },
  {
    id: "OS-2044",
    title: "Substituição da correia de transmissão",
    asset: "EST-005",
    priority: "Média",
    type: "Corretiva",
    technician: "Carlos Silva",
    status: "Concluída",
    tasks: [true, true, true],
    logs: ["16:42 · Manutenção concluída."],
  },
  {
    id: "OS-2043",
    title: "Análise do circuito hidráulico",
    asset: "PRS-006",
    priority: "Alta",
    type: "Preditiva",
    technician: "Pedro Santos",
    status: "Triagem",
    tasks: [false, false, false],
    logs: ["15:10 · Ordem criada."],
  },
];
export const statusColor = (status: string) =>
  status === "Operando" || status === "Concluída"
    ? "text-success"
    : status === "Parada Crítica" || status === "Crítica"
      ? "text-destructive"
      : status === "Em Manutenção" || status === "Alta" || status === "Em Execução"
        ? "text-warning"
        : "text-primary";
export function filterOrders(
  orders: Order[],
  filters: { search: string; priority: string; type: string; technician: string },
) {
  return orders.filter(
    (o) =>
      (!filters.search ||
        `${o.id} ${o.title} ${o.asset}`.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.priority || o.priority === filters.priority) &&
      (!filters.type || o.type === filters.type) &&
      (!filters.technician || o.technician === filters.technician),
  );
}
