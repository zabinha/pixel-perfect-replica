import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Gauge,
  Timer,
  Clock3,
  ClipboardList,
  Sparkles,
  CircleCheck,
  Wrench,
  Zap,
  CalendarDays,
  ChevronDown,
  Radio,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { assets, statusColor } from "./data";
import { useNexus } from "./provider";
import { useReducedMotion } from "framer-motion";
export function PageHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="flex items-center gap-3">
          <h1>{title}</h1>
        </div>
        <p className="subtitle">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let frame: number;
    const start = performance.now();
    function tick(t: number) {
      const p = Math.min((t - start) / 800, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return <>{value % 1 ? n.toFixed(1).replace(".", ",") : Math.round(n)}</>;
}
const points = [52, 45, 53, 48, 67, 64, 73, 65, 79, 72, 85, 81, 90, 84, 94];
export function Dashboard() {
  const { plant, orders, newOrder, openOrder } = useNexus();
  const [period, setPeriod] = useState("7d");
  const data = Array.from({ length: period === "7d" ? 7 : period === "30d" ? 10 : 13 }, (_, i) => ({
    day:
      period === "7d"
        ? `${5 + i} nov`
        : `${1 + i * (period === "30d" ? 3 : 7)} ${period === "90d" ? "set" : "nov"}`,
    health: [76, 79, 77, 84, 81, 87, 89, 85, 91, 86, 92, 89, 94][i],
    done: [31, 38, 35, 47, 44, 53, 59, 49, 56, 52, 61, 65, 67][i],
    pending: [18, 20, 17, 22, 19, 16, 14, 17, 13, 15, 12, 11, 9][i],
  }));
  const kpis = [
    {
      title: "OEE Global",
      value: 87.6,
      unit: "%",
      change: "+4,2%",
      detail: "vs. período anterior",
      icon: Gauge,
      color: "text-primary",
      stroke: "var(--primary)",
    },
    {
      title: "MTBF",
      value: 342,
      unit: "h",
      change: "+12,8%",
      detail: "vs. período anterior",
      icon: Timer,
      color: "text-success",
      stroke: "var(--success)",
    },
    {
      title: "MTTR",
      value: 2.4,
      unit: "h",
      change: "−8,5%",
      detail: "vs. período anterior",
      icon: Clock3,
      color: "text-warning",
      stroke: "var(--warning)",
    },
    {
      title: "Backlog de Manutenção",
      value: 24 + orders.length - 6,
      unit: "",
      change: "−3 ordens",
      detail: "vs. semana anterior",
      icon: ClipboardList,
      color: "text-primary",
      stroke: "var(--primary)",
    },
  ];
  function exportReport() {
    const csv =
      "Métrica;Valor\nOEE Global;87,6%\nMTBF;342h\nMTTR;2,4h\nBacklog;" + (24 + orders.length - 6);
    const a = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.href = url;
    a.download = "nexus-relatorio.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="text-[10px] text-muted-foreground flex items-center gap-2 mb-5">
        <LayoutMini />
        Área de trabalho <ChevronRight size={11} />
        <span className="text-foreground">Command Center</span>
      </div>
      <PageHeading
        title="Command Center"
        subtitle={`Visão integrada da operação. Tudo sob controle na planta ${plant}.`}
      >
        <div className="flex gap-2">
          <Button variant="outline" className="text-[11px] h-8">
            <CalendarDays />
            11 nov, 2026
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Exportar relatório"
            title="Exportar relatório"
            onClick={exportReport}
          >
            <Download />
          </Button>
        </div>
      </PageHeading>
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div className="panel kpi" key={k.title}>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>{k.title}</span>
              <k.icon className="kpi-icon" />
            </div>
            <div className="kpi-value">
              <AnimatedNumber value={k.value} />
              <span className="text-xl text-muted-foreground ml-1">{k.unit}</span>
            </div>
            <svg className="spark" viewBox="0 0 100 42" aria-hidden="true">
              <path
                d={`M0 40 ${points.map((v, j) => `L${j * 7.1} ${40 - (i === 2 ? 100 - v : v - 40) * 0.6}`).join(" ")}`}
                fill="none"
                stroke={k.stroke}
                strokeWidth="1.8"
              />
            </svg>
            <div className="kpi-foot">
              <span className="text-success flex items-center">
                {i > 1 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} {k.change}
              </span>
              <span className="text-muted-foreground">{k.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-middle">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title">Performance da planta</h2>
              <p className="text-[10px] text-muted-foreground mt-2">
                Saúde operacional e evolução das ordens de serviço
              </p>
            </div>
            <div className="segment">
              {["7d", "30d", "90d"].map((p) => (
                <Button
                  key={p}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className={`h-6 px-2.5 text-[10px] text-muted-foreground ${p === period ? "selected" : ""}`}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 13, bottom: 10, left: -18 }}>
                <defs>
                  <linearGradient id="health-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="done-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={9}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  name="Saúde da planta (%)"
                  type="monotone"
                  dataKey="health"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#health-fill)"
                />
                <Area
                  name="Ordens concluídas"
                  type="monotone"
                  dataKey="done"
                  stroke="var(--success)"
                  strokeWidth={2}
                  fill="url(#done-fill)"
                />
                <Area
                  name="Ordens pendentes"
                  type="monotone"
                  dataKey="pending"
                  stroke="var(--warning)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Saúde da planta
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Concluídas
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Pendentes
            </span>
          </div>
        </section>
        <section className="panel insight-panel">
          <div className="panel-heading">
            <h2 className="panel-title flex gap-2 items-center">
              <Sparkles size={17} className="text-primary" />
              Insights preditivos
            </h2>
            <span className="text-[9px] text-primary border border-primary/25 bg-accent px-1.5 py-0.5 rounded">
              NEXUS AI
            </span>
          </div>
          <div className="insight">
            <div className="text-[9px] text-warning flex items-center gap-1.5 mb-2">
              <Zap size={11} />
              ATENÇÃO RECOMENDADA
            </div>
            <h3>Desgaste no rolamento do CNC-001</h3>
            <p>
              Padrão de vibração indica possível falha em{" "}
              <span className="text-foreground">72 horas</span>. Antecipe a inspeção preventiva.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Confiança <span className="text-primary ml-1">94,8%</span>
              </span>
              <Button
                variant="link"
                className="h-auto p-0 text-[10px]"
                onClick={() => newOrder("CNC-001", "Inspeção preventiva do rolamento CNC-001")}
              >
                Criar OS <ArrowUpRight size={12} />
              </Button>
            </div>
          </div>
          <div className="insight">
            <div className="text-[9px] text-primary flex items-center gap-1.5 mb-2">
              <Activity size={11} />
              OPORTUNIDADE
            </div>
            <h3>Otimize o consumo de energia</h3>
            <p>
              Ajustar o ciclo do compressor pode reduzir o consumo em{" "}
              <span className="text-success">12%</span>.
            </p>
            <Link to="/preditiva" className="text-primary text-[10px] flex items-center gap-1">
              Ver análise completa <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-3 border-t text-[9px] text-muted-foreground flex items-center gap-2">
            <Sparkles size={11} />
            Análise simulada · Atualizada há 2 min
          </div>
        </section>
      </div>
      <div className="dashboard-bottom">
        <section className="panel">
          <div className="panel-heading">
            <h2 className="panel-title">Monitoramento de ativos</h2>
            <span className="text-[9px] text-success flex items-center gap-2">
              <span className="dot live-dot" />
              AO VIVO
            </span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Status</th>
                  <th>Saúde</th>
                  <th>Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 4).map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="activity-icon">
                          <CpuMini />
                        </div>
                        <div>
                          <div className="font-medium whitespace-nowrap">{a.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-1">
                            {a.id} · {a.sector}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status ${statusColor(a.status)}`}>
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <div className={`min-w-16 ${statusColor(a.status)}`}>
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span>{a.health}%</span>
                        </div>
                        <div className="progress-track">
                          <span style={{ width: `${a.health}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={a.temp > 70 ? "text-destructive" : "text-muted-foreground"}>
                        {a.temp.toFixed(1).replace(".", ",")} °C
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t px-5 py-3 flex justify-between text-[10px] text-muted-foreground">
            <span>Exibindo 4 de 6 ativos monitorados</span>
            <Link to="/ativos" className="text-primary flex items-center gap-1">
              Todos os ativos <ChevronRight size={12} />
            </Link>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2 className="panel-title">Atividade recente</h2>
            <Link
              to="/ordens"
              className="text-[10px] text-muted-foreground flex items-center gap-1"
            >
              Ver tudo <ChevronRight size={12} />
            </Link>
          </div>
          {[
            {
              icon: CircleCheck,
              color: "text-success",
              title: "OS-2044 concluída",
              detail: "Correia substituída · Carlos Silva",
              time: "Há 12 min",
              id: "OS-2044",
            },
            {
              icon: Wrench,
              color: "text-warning",
              title: "Manutenção iniciada no GER-004",
              detail: "Inspeção do arrefecimento · Pedro Santos",
              time: "Há 28 min",
              id: "OS-2046",
            },
            {
              icon: Zap,
              color: "text-destructive",
              title: "Alerta crítico no CMP-002",
              detail: "Vibração acima do limite · 8,4 mm/s",
              time: "Há 42 min",
              id: "OS-2048",
            },
            {
              icon: Sparkles,
              color: "text-primary",
              title: "Nova previsão de manutenção",
              detail: "CNC-001 · Inspeção recomendada",
              time: "Há 1 hora",
              id: "OS-2047",
            },
          ].map((a) => (
            <div className="activity-row" key={a.title}>
              <div className={`activity-icon ${a.color}`}>
                <a.icon size={14} />
              </div>
              <div className="flex-1">
                <Button
                  variant="link"
                  className="p-0 h-auto text-foreground text-[11px] text-left whitespace-normal"
                  onClick={() => {
                    const o = orders.find((o) => o.id === a.id);
                    if (o) openOrder(o);
                  }}
                >
                  {a.title}
                </Button>
                <div className="text-[10px] text-muted-foreground mt-1.5">{a.detail}</div>
                <small className="block mt-1.5">{a.time}</small>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
function LayoutMini() {
  return <Gauge size={12} />;
}
function CpuMini() {
  return <Activity size={14} className="text-muted-foreground" />;
}
