import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  Cpu,
  Sparkles,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronsLeft,
  Menu,
  Moon,
  Sun,
  Settings,
  CircleHelp,
  ArrowUpRight,
  Building2,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Toaster, toast } from "sonner";
import { initialOrders, assets, statuses, statusColor, type Order, type OrderStatus } from "./data";
import { motion, useReducedMotion } from "framer-motion";
const navigation = [
  { to: "/" as const, label: "Command Center", icon: LayoutDashboard },
  { to: "/ordens" as const, label: "Ordens de Serviço", icon: ClipboardList },
  { to: "/ativos" as const, label: "Ativos & Telemetria", icon: Cpu },
  { to: "/preditiva" as const, label: "Manutenção Preditiva", icon: Sparkles },
];
type NexusContext = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  newOrder: (asset?: string, title?: string) => void;
  openOrder: (o: Order) => void;
  plant: string;
};
const Context = createContext<NexusContext | null>(null);
export function useNexus() {
  const c = useContext(Context);
  if (!c) throw new Error("Nexus provider missing");
  return c;
}
export function NexusProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(initialOrders);
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [light, setLight] = useState(false);
  const [plant, setPlant] = useState("São Paulo");
  const [create, setCreate] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState(false);
  const [read, setRead] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [asset, setAsset] = useState("CNC-001");
  const [priority, setPriority] = useState("Média");
  const [type, setType] = useState("Preventiva");
  const [technician, setTechnician] = useState("Ana Souza");
  const [utility, setUtility] = useState<"settings" | "help" | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const order = orders.find((o) => o.id === selected);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    return () => document.documentElement.classList.remove("light");
  }, [light]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  function newOrder(a?: string, t?: string) {
    setAsset(a ?? "CNC-001");
    setTitle(t ?? "");
    setCreate(true);
  }
  function updateStatus(status: OrderStatus) {
    if (!order) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, status, logs: [`Agora · Status alterado para ${status}.`, ...o.logs] }
          : o,
      ),
    );
    toast.success("Status da ordem atualizado");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Order = {
      id: `OS-${2049 + orders.length - initialOrders.length}`,
      title: title.trim(),
      asset,
      priority,
      type,
      technician,
      status: "Triagem",
      tasks: [false, false, false],
      logs: ["Agora · Ordem de serviço criada."],
    };
    setOrders((prev) => [next, ...prev]);
    setCreate(false);
    toast.success(`${next.id} criada com sucesso`);
    navigate({ to: "/ordens" });
  }
  return (
    <Context.Provider
      value={{ orders, setOrders, newOrder, openOrder: (o) => setSelected(o.id), plant }}
    >
      <div className={`app-shell ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
        {mobile && (
          <Button
            variant="ghost"
            className="fixed inset-0 z-20 h-full w-full bg-overlay rounded-none md:hidden"
            aria-label="Fechar menu"
            onClick={() => setMobile(false)}
          />
        )}
        <aside className="sidebar">
          <Link to="/" className="brand">
            <svg viewBox="0 0 30 32" className="brand-mark" fill="none" aria-hidden="true">
              <path
                d="M3 25V7l8 5v18M11 2l8 5v18l8-5V2M3 7l16 18M11 12l16-10"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand-text">
              Nexus<span className="text-muted-foreground font-normal">CMMS</span>
            </span>
          </Link>
          <div className="nav-label">Área de trabalho</div>
          <nav>
            {navigation.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                title={n.label}
                onClick={() => setMobile(false)}
                className={`nav-item ${pathname === n.to ? "active" : ""}`}
              >
                <n.icon />
                <span className="nav-text">{n.label}</span>
                {n.to === "/preditiva" && (
                  <span className="nav-text ml-auto text-[9px] border border-primary/25 rounded px-1.5 py-0.5">
                    IA
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="nav-label">Gerenciamento</div>
          <Button
            variant="ghost"
            className="nav-item justify-start w-full"
            onClick={() => setUtility("settings")}
          >
            <Settings />
            <span className="nav-text">Configurações</span>
          </Button>
          <Button
            variant="ghost"
            className="nav-item justify-start w-full"
            onClick={() => setUtility("help")}
          >
            <CircleHelp />
            <span className="nav-text">Central de ajuda</span>
            <ArrowUpRight className="nav-text ml-auto" />
          </Button>
          <div className="sidebar-bottom">
            <div className="connection">
              <div className="flex items-center gap-2">
                <span className="dot live-dot" />
                <span>Sistemas conectados</span>
              </div>
              <div className="text-muted-foreground mt-2 text-[10px]">
                24 sensores · Sincronização ativa
              </div>
              <div className="mt-3 flex justify-between text-[9px] text-muted-foreground">
                <span>Ambiente de demonstração</span>
                <Activity size={12} className="text-success" />
              </div>
            </div>
            <div className="flex gap-3 items-center border-t pt-5 px-2">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-xs font-medium shrink-0">
                RC
              </div>
              <div className="user-info">
                <div className="text-xs font-medium">Rafael Costa</div>
                <div className="text-[10px] text-muted-foreground mt-1">Gestor de manutenção</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Recolher menu"
                title="Recolher menu"
                className="ml-auto desktop-only"
                onClick={() => setCollapsed((v) => !v)}
              >
                <ChevronsLeft />
              </Button>
            </div>
          </div>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
                onClick={() => setMobile((v) => !v)}
              >
                <Menu />
              </Button>
              <Button
                variant="ghost"
                className="search-trigger"
                onClick={() => setSearch(true)}
                aria-label="Busca global"
              >
                <Search size={16} />
                <span className="search-text">Buscar ativos, ordens, insights...</span>
                <kbd className="search-text ml-auto text-[10px] border border-border rounded px-1.5 py-0.5">
                  ⌘ K
                </kbd>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="plant-select flex items-center gap-2 text-xs">
                <Building2 size={15} className="text-muted-foreground" />
                <select
                  aria-label="Planta industrial"
                  className="border-0 bg-transparent p-0 text-xs"
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                >
                  <option>São Paulo</option>
                  <option>Curitiba</option>
                  <option>Joinville</option>
                </select>
              </div>
              <span className="desktop-only h-5 border-l" />
              <Button
                variant="ghost"
                size="icon"
                aria-label={light ? "Ativar tema escuro" : "Ativar tema claro"}
                title="Alternar tema"
                onClick={() => setLight((v) => !v)}
              >
                {light ? <Moon /> : <Sun />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notificações"
                className="relative"
                onClick={() => setAlerts(true)}
              >
                <Bell />
                {!read && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-destructive" />
                )}
              </Button>
              <Button onClick={() => newOrder()} className="text-xs h-9">
                <Plus />
                <span className="hidden sm:inline">Nova Ordem de Serviço</span>
                <span className="sm:hidden">Nova OS</span>
              </Button>
            </div>
          </header>
          <motion.main
            key={pathname}
            initial={reduced ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="main-content"
          >
            {children}
            <footer className="footer">
              <span className="flex items-center gap-2">
                <span className="dot" />
                Todos os sistemas operacionais <span className="mx-1">·</span> Dados simulados
              </span>
              <span>
                NexusCMMS <span className="mx-2">·</span> v2.4.0
              </span>
            </footer>
          </motion.main>
        </div>
      </div>
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[calc(100%-32px)]">
          <DialogTitle>Nova ordem de serviço</DialogTitle>
          <DialogDescription>Planta {plant} · Equipe de manutenção</DialogDescription>
          <form onSubmit={submit} className="space-y-5 mt-2">
            <label className="field">
              Título da ordem
              <input
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Inspeção do eixo principal"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Ativo
                <select value={asset} onChange={(e) => setAsset(e.target.value)}>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} · {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Prioridade
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  {["Crítica", "Alta", "Média", "Baixa"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Tipo de manutenção
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {["Preventiva", "Corretiva", "Preditiva"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Técnico responsável
                <select value={technician} onChange={(e) => setTechnician(e.target.value)}>
                  {["Ana Souza", "Carlos Silva", "Pedro Santos"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus />
                Criar ordem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="w-[calc(100%-32px)] p-0 overflow-hidden">
          <div className="p-5 border-b">
            <DialogTitle className="text-sm mb-3">Busca global</DialogTitle>
            <DialogDescription className="sr-only">
              Pesquisar módulos, ativos e ordens de serviço
            </DialogDescription>
            <div className="flex items-center gap-3">
              <Search className="text-primary" size={18} />
              <input
                autoFocus
                aria-label="Pesquisar"
                placeholder="O que você está procurando?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent p-0 w-full"
              />
            </div>
          </div>
          <div className="p-3 max-h-[60vh] overflow-y-auto">
            {navigation
              .filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
              .map((n) => (
                <Button
                  key={n.to}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate({ to: n.to });
                    setSearch(false);
                  }}
                >
                  <n.icon />
                  {n.label}
                  <ArrowUpRight className="ml-auto text-muted-foreground" />
                </Button>
              ))}
            {assets
              .filter((a) => `${a.name} ${a.id}`.toLowerCase().includes(query.toLowerCase()))
              .map((a) => (
                <Button
                  key={a.id}
                  variant="ghost"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    navigate({ to: "/ativos" });
                    setSearch(false);
                  }}
                >
                  <Cpu />
                  {a.name}
                  <span className="ml-auto text-muted-foreground">{a.id}</span>
                </Button>
              ))}
            {orders
              .filter((o) => `${o.id} ${o.title}`.toLowerCase().includes(query.toLowerCase()))
              .map((o) => (
                <Button
                  key={o.id}
                  variant="ghost"
                  className="w-full justify-start text-xs h-auto py-3 whitespace-normal text-left"
                  onClick={() => {
                    setSelected(o.id);
                    setSearch(false);
                  }}
                >
                  <ClipboardList />
                  {o.title}
                  <span className="ml-auto shrink-0 text-muted-foreground">{o.id}</span>
                </Button>
              ))}
            {query &&
              ![
                ...navigation.map((n) => n.label),
                ...assets.map((a) => `${a.name} ${a.id}`),
                ...orders.map((o) => `${o.id} ${o.title}`),
              ].some((t) => t.toLowerCase().includes(query.toLowerCase())) && (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum resultado encontrado.
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>
      <Sheet
        open={!!order}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {order && (
            <>
              <span className="text-primary text-xs">{order.id}</span>
              <SheetTitle className="mt-3 pr-4 leading-relaxed">{order.title}</SheetTitle>
              <SheetDescription className="mt-2">
                {order.asset} · {order.type} · {order.technician}
              </SheetDescription>
              <div className="flex gap-4 items-center mt-7">
                <span className={statusColor(order.priority)}>{order.priority}</span>
                <select
                  aria-label="Status da ordem"
                  value={order.status}
                  onChange={(e) => updateStatus(e.target.value as OrderStatus)}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <h3 className="font-medium mt-8 mb-4">Checklist de manutenção</h3>
              {[
                "Inspecionar equipamento e isolar energia",
                "Executar manutenção e substituir componentes",
                "Validar funcionamento e registrar leituras",
              ].map((t, i) => (
                <label
                  key={t}
                  className="flex items-center gap-3 py-4 border-b text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={order.tasks[i]}
                    onChange={() =>
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id
                            ? { ...o, tasks: o.tasks.map((v, j) => (i === j ? !v : v)) }
                            : o,
                        ),
                      )
                    }
                    className="accent-primary w-4 h-4"
                  />
                  <span className={order.tasks[i] ? "line-through text-muted-foreground" : ""}>
                    {t}
                  </span>
                </label>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-7">
                <div>
                  <p className="text-muted-foreground text-xs">Tempo estimado</p>
                  <p className="mt-2">2h 30min</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Peças necessárias</p>
                  <p className="mt-2 text-xs">Rolamento 6205 · Kit de vedação</p>
                </div>
              </div>
              <h3 className="font-medium mt-8 mb-4">Histórico de atividades</h3>
              {order.logs.map((l, i) => (
                <p key={`${l}-${i}`} className="text-xs text-muted-foreground border-l pl-4 py-3">
                  {l}
                </p>
              ))}
              <Button
                className="w-full mt-8"
                onClick={() =>
                  updateStatus(
                    statuses[(statuses.indexOf(order.status) + 1) % statuses.length] ?? "Triagem",
                  )
                }
              >
                <Activity />
                {order.status === "Concluída" ? "Reabrir ordem" : "Avançar status"}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Sheet open={alerts} onOpenChange={setAlerts}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetTitle>Central de notificações</SheetTitle>
          <SheetDescription className="mt-2">Alertas da planta {plant}</SheetDescription>
          <div className="mt-8 space-y-6">
            <div className="flex gap-3">
              <Zap className="text-destructive shrink-0" size={18} />
              <div>
                <p className="font-medium text-sm">Parada crítica · CMP-002</p>
                <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                  Vibração de 8,4 mm/s. Carlos Silva está executando a ordem OS-2048.
                </p>
                <Button
                  variant="link"
                  className="p-0 mt-2"
                  onClick={() => {
                    setSelected("OS-2048");
                    setAlerts(false);
                  }}
                >
                  Ver ordem <ArrowUpRight />
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="text-primary shrink-0" size={18} />
              <div>
                <p className="font-medium text-sm">Anomalia detectada no Torno CNC</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Risco de desgaste em 72 horas. Inspeção recomendada.
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-8"
            onClick={() => {
              setRead(true);
              toast.success("Notificações marcadas como lidas");
            }}
          >
            Marcar todas como lidas
          </Button>
        </SheetContent>
      </Sheet>
      <Dialog
        open={utility !== null}
        onOpenChange={(v) => {
          if (!v) setUtility(null);
        }}
      >
        <DialogContent className="w-[calc(100%-32px)]">
          <DialogTitle>
            {utility === "settings" ? "Configurações da área de trabalho" : "Central de ajuda"}
          </DialogTitle>
          <DialogDescription>NexusCMMS · Ambiente de demonstração</DialogDescription>
          {utility === "settings" ? (
            <div className="space-y-5 py-3">
              <label className="field">
                Unidade selecionada
                <select value={plant} onChange={(e) => setPlant(e.target.value)}>
                  {["São Paulo", "Curitiba", "Joinville"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-center justify-between">
                <span>Tema da interface</span>
                <Button variant="outline" onClick={() => setLight((v) => !v)}>
                  {light ? <Sun /> : <Moon />}
                  {light ? "Claro" : "Escuro"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">24 sensores simulados · Versão 2.4.0</p>
            </div>
          ) : (
            <div className="space-y-5 mt-3">
              {["O que é OEE?", "Como são calculadas as previsões?", "Meus dados são reais?"].map(
                (t, i) => (
                  <details key={t} className="border-b pb-4">
                    <summary className="cursor-pointer font-medium">{t}</summary>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                      {
                        [
                          "O OEE combina disponibilidade, desempenho e qualidade para medir a eficiência global dos equipamentos.",
                          "Este ambiente usa anomalias e previsões simuladas de sensores industriais. Nenhuma análise real de IA está conectada.",
                          "Não. Os ativos, técnicos e leituras são fictícios. Alterações ficam disponíveis durante esta sessão.",
                        ][i]
                      }
                    </p>
                  </details>
                ),
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Toaster
        position="bottom-right"
        theme={light ? "light" : "dark"}
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
          },
        }}
      />
    </Context.Provider>
  );
}
