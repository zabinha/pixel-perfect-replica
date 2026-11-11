import { useState } from "react";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  ArrowUpRight,
  Cpu,
  Wind,
  Bot,
  Zap,
  Activity,
  Thermometer,
  Clock3,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { assets, statuses, statusColor, filterOrders, type Order } from "./data";
import { useNexus } from "./provider";
import { PageHeading } from "./dashboard";
import cnc from "@/assets/cnc-machine.jpg";
export function OrdersView() {
  const { orders, newOrder, openOrder, plant } = useNexus();
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [technician, setTechnician] = useState("");
  const filtered = filterOrders(orders, { search, priority, type, technician });
  return (
    <>
      <PageHeading
        title="Ordens de Serviço"
        subtitle={`${orders.length} ordens de serviço · Planta ${plant}`}
      >
        <div className="segment">
          <Button
            variant="ghost"
            size="sm"
            className={view === "kanban" ? "selected" : ""}
            onClick={() => setView("kanban")}
          >
            <LayoutGrid />
            Quadro Kanban
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={view === "list" ? "selected" : ""}
            onClick={() => setView("list")}
          >
            <List />
            Lista
          </Button>
        </div>
      </PageHeading>
      <div className="filters">
        <div className="relative flex-1 min-w-44">
          <Search size={15} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            className="w-full pl-9"
            aria-label="Buscar ordens"
            placeholder="Buscar ordens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar prioridade"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Todas as prioridades</option>
          {["Crítica", "Alta", "Média", "Baixa"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select aria-label="Filtrar tipo" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todos os tipos</option>
          {["Preventiva", "Corretiva", "Preditiva"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Filtrar técnico"
          value={technician}
          onChange={(e) => setTechnician(e.target.value)}
        >
          <option value="">Todos os técnicos</option>
          {["Ana Souza", "Carlos Silva", "Pedro Santos"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      {view === "kanban" ? (
        <div className="kanban">
          {statuses.map((s) => (
            <section key={s} className="kanban-column">
              <div className="flex justify-between items-center py-3 border-b">
                <h2 className="text-xs font-medium flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-current ${statusColor(s)}`} />
                  {s}
                  <span className="text-muted-foreground text-[10px] ml-1">
                    {filtered.filter((o) => o.status === s).length}
                  </span>
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label={`Nova ordem em ${s}`}
                  onClick={() => newOrder()}
                >
                  <Plus />
                </Button>
              </div>
              {filtered
                .filter((o) => o.status === s)
                .map((o) => (
                  <OrderCard key={o.id} order={o} open={() => openOrder(o)} />
                ))}
              {!filtered.some((o) => o.status === s) && (
                <p className="text-center text-muted-foreground text-xs py-10">Nenhuma ordem</p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <section className="panel table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Ativo</th>
                <th>Prioridade</th>
                <th>Técnico</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-foreground text-xs"
                      onClick={() => openOrder(o)}
                    >
                      {o.title}
                    </Button>
                    <p className="text-muted-foreground text-[10px] mt-1">
                      {o.id} · {o.type}
                    </p>
                  </td>
                  <td>{o.asset}</td>
                  <td className={statusColor(o.priority)}>{o.priority}</td>
                  <td className="whitespace-nowrap">{o.technician}</td>
                  <td className={statusColor(o.status)}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="text-center text-muted-foreground py-12">Nenhuma ordem encontrada.</p>
          )}
        </section>
      )}
    </>
  );
}
function OrderCard({ order: o, open }: { order: Order; open: () => void }) {
  return (
    <Button variant="ghost" className="order-card hover:border-primary/40" onClick={open}>
      <div className="flex justify-between gap-2 text-[10px]">
        <span className="text-muted-foreground">{o.id}</span>
        <span className={statusColor(o.priority)}>{o.priority}</span>
      </div>
      <h3 className="font-medium text-xs leading-relaxed mt-3">{o.title}</h3>
      <div className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
        <Cpu size={12} />
        {o.asset} · {o.type}
      </div>
      <div className="flex justify-between items-center border-t mt-4 pt-3">
        <div className="flex gap-2 items-center text-[10px] text-muted-foreground">
          <span className="bg-secondary rounded-full w-6 h-6 flex items-center justify-center">
            {o.technician
              .split(" ")
              .map((t) => t[0])
              .join("")}
          </span>
          {o.technician}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {o.tasks.filter(Boolean).length}/3
        </span>
      </div>
    </Button>
  );
}
export function AssetsView() {
  const [status, setStatus] = useState("");
  const [sector, setSector] = useState("");
  const [search, setSearch] = useState("");
  const { newOrder, plant } = useNexus();
  const filtered = assets.filter(
    (a) =>
      (!status || a.status === status) &&
      (!sector || a.sector === sector) &&
      `${a.id} ${a.name}`.toLowerCase().includes(search.toLowerCase()),
  );
  const icons = [Cpu, Wind, Bot, Zap, Activity, Cpu];
  return (
    <>
      <PageHeading
        title="Ativos & Telemetria IoT"
        subtitle={`${assets.length} ativos monitorados · 24 sensores conectados · Planta ${plant}`}
      >
        <span className="text-success flex gap-2 items-center text-xs">
          <span className="dot live-dot" />
          Telemetria simulada ao vivo
        </span>
      </PageHeading>
      <div className="filters">
        <input
          className="flex-1"
          aria-label="Buscar ativos"
          placeholder="Buscar equipamento ou tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Status dos ativos"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          {["Operando", "Em Manutenção", "Parada Crítica"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Setor dos ativos"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">Todos os setores</option>
          {["Usinagem", "Montagem", "Utilidades"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="asset-grid">
        {filtered.map((a) => {
          const Icon = icons[assets.indexOf(a)] ?? Cpu;
          return (
            <article className="panel" key={a.id}>
              {a.id === "CNC-001" ? (
                <img
                  src={cnc}
                  alt="Torno CNC industrial"
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="asset-image"
                />
              ) : (
                <div className="machine-visual">
                  <Icon />
                </div>
              )}
              <div className="p-5 border-t">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>
                    {a.id} · {a.sector}
                  </span>
                  <span className={`status ${statusColor(a.status)}`}>
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {a.status}
                  </span>
                </div>
                <h2 className="font-semibold mt-3 text-base">{a.name}</h2>
                <div className="grid grid-cols-3 gap-2 my-6">
                  {[
                    {
                      icon: Thermometer,
                      label: "Temperatura",
                      value: `${a.temp.toFixed(1).replace(".", ",")} °C`,
                    },
                    {
                      icon: Activity,
                      label: "Vibração",
                      value: `${a.vibration.toFixed(1).replace(".", ",")} mm/s`,
                    },
                    {
                      icon: Clock3,
                      label: "Operação",
                      value: `${a.hours.toLocaleString("pt-BR")} h`,
                    },
                  ].map((v) => (
                    <div key={v.label}>
                      <v.icon size={14} className="text-muted-foreground mb-2" />
                      <div className="text-[9px] text-muted-foreground">{v.label}</div>
                      <div
                        className={`font-medium text-xs mt-1 ${v.label === "Temperatura" && a.temp > 70 ? "text-destructive" : ""}`}
                      >
                        {v.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
                  <span>Próxima revisão preventiva</span>
                  <span>{a.review}% do ciclo</span>
                </div>
                <div
                  className={`progress-track ${a.review > 85 ? "text-warning" : "text-primary"}`}
                >
                  <span style={{ width: `${a.review}%` }} />
                </div>
                <div className="flex justify-between items-center mt-5">
                  <span className={`text-[10px] ${statusColor(a.status)}`}>Saúde: {a.health}%</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[10px]"
                    onClick={() => newOrder(a.id, `Inspeção de ${a.name}`)}
                  >
                    Programar manutenção <ArrowUpRight />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <p className="py-20 text-muted-foreground text-center">Nenhum ativo encontrado.</p>
      )}
    </>
  );
}
export function PredictiveView() {
  const { newOrder } = useNexus();
  const [filter, setFilter] = useState("Todas");
  const insights = [
    {
      asset: "CNC-001",
      title: "Desgaste progressivo no rolamento",
      risk: "Alta",
      confidence: "94,8%",
      time: "72 horas",
      detail:
        "Elevação de 18% na vibração do eixo principal. O padrão é compatível com desgaste de rolamento e requer inspeção preventiva.",
      icon: Activity,
    },
    {
      asset: "CMP-002",
      title: "Eficiência energética reduzida",
      risk: "Média",
      confidence: "91,2%",
      time: "7 dias",
      detail:
        "O ciclo de carga atual apresenta consumo 12% acima do esperado. Ajuste do ciclo e inspeção das vedações recomendados.",
      icon: Zap,
    },
    {
      asset: "GER-004",
      title: "Tendência de aquecimento",
      risk: "Alta",
      confidence: "89,6%",
      time: "48 horas",
      detail:
        "A temperatura do sistema de arrefecimento apresentou variação de 8 °C. Verificar fluido refrigerante e condição do radiador.",
      icon: Thermometer,
    },
  ];
  return (
    <>
      <PageHeading
        title="Manutenção Preditiva IA"
        subtitle="Inteligência operacional para antecipar falhas e proteger seus ativos."
      >
        <span className="text-primary bg-accent border border-primary/25 rounded px-3 py-2 text-[10px] flex items-center gap-2">
          <Sparkles size={13} />
          NEXUS AI · SIMULAÇÃO
        </span>
      </PageHeading>
      <div className="kpi-grid mb-7">
        {[
          { label: "Ativos analisados", value: "6", icon: Cpu },
          { label: "Anomalias detectadas", value: "3", icon: Activity },
          { label: "Confiança média", value: "91,9%", icon: ShieldCheck },
          { label: "Economia potencial", value: "R$ 18.400", icon: TrendingUp },
        ].map((k) => (
          <div className="panel kpi" key={k.label}>
            <div className="flex justify-between text-muted-foreground text-xs">
              {k.label}
              <k.icon size={15} />
            </div>
            <div className="text-2xl font-semibold mt-5">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-medium">Previsões e recomendações</h2>
        <select
          aria-label="Filtrar risco"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Todas</option>
          <option>Alta</option>
          <option>Média</option>
        </select>
      </div>
      <div className="space-y-4">
        {insights
          .filter((i) => filter === "Todas" || i.risk === filter)
          .map((i) => (
            <article key={i.asset} className="panel p-6">
              <div className="flex gap-4">
                <div className="activity-icon text-primary">
                  <i.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-xs text-muted-foreground">{i.asset}</span>
                      <h3 className="font-medium text-base mt-2">{i.title}</h3>
                    </div>
                    <span className={`text-xs ${statusColor(i.risk)}`}>
                      Risco {i.risk.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-3 max-w-2xl">
                    {i.detail}
                  </p>
                  <div className="flex justify-between items-center gap-4 flex-wrap mt-6">
                    <div className="flex gap-6 text-[11px]">
                      <span className="text-muted-foreground">
                        Confiança <span className="text-primary ml-2">{i.confidence}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Horizonte <span className="text-foreground ml-2">{i.time}</span>
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => newOrder(i.asset, i.title)}>
                      <Plus />
                      Criar ordem preventiva
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>
    </>
  );
}
