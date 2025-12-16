import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Building2,
  Users,
  Package,
  FileText,
  DollarSign,
  ShoppingCart,
  Package2,
  RefreshCcw,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronRight,
  Settings,
  Moon,
  LogOut,
  Bell,
  Columns,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { RecordsTable } from "@/components/records-table";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboards",
    label: "Дашборды",
    icon: LayoutDashboard,
  },
  {
    id: "monthly-summary",
    label: "Сводка за месяц",
    icon: Calendar,
  },
  {
    id: "reference",
    label: "Справочники",
    icon: BookOpen,
    children: [
      { id: "organizations", label: "Организации", icon: Building2 },
      { id: "counterparties", label: "Контрагенты", icon: Users },
      { id: "nomenclature", label: "Номенклатура", icon: Package },
      {
        id: "nomenclature-list",
        label: "Номенклатура (список)",
        icon: FileText,
      },
      { id: "marketplaces", label: "Маркетплейсы", icon: ShoppingCart },
      { id: "goods-mp", label: "Товары МП", icon: Package2 },
    ],
  },
  {
    id: "documents",
    label: "Документы",
    icon: FileText,
    children: [
      { id: "sales-mp", label: "Продажи МП", icon: DollarSign },
      { id: "ozon-fbs", label: "OZON FBS Posting", icon: Package },
      { id: "ozon-fbo", label: "OZON FBO Posting", icon: Package },
      { id: "wb-orders", label: "WB Orders", icon: ShoppingCart },
      { id: "wb-sales", label: "WB Sales", icon: DollarSign },
      { id: "ym-orders", label: "YM Orders", icon: ShoppingCart },
    ],
  },
  {
    id: "integrations",
    label: "Интеграции",
    icon: RefreshCcw,
    children: [
      { id: "connections-1c", label: "Подключения 1С", icon: Package },
      { id: "connections-mp", label: "Подключения МП", icon: ShoppingCart },
      { id: "import-ut11", label: "Импорт из УТ 11", icon: Download },
      { id: "import-ozon", label: "Импорт из OZON", icon: Download },
      { id: "returns-ozon", label: "Возвраты OZON", icon: RotateCcw },
      { id: "returns-yandex", label: "Возвраты Yandex", icon: RotateCcw },
      { id: "transactions-ozon", label: "Транзакции OZON", icon: DollarSign },
    ],
  },
];

export function IntegratorDashboard() {
  const [openSections, setOpenSections] = useState<string[]>([
    "reference",
    "documents",
    "integrations",
  ]);
  const [activeItem, setActiveItem] = useState("returns-yandex");

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.includes(item.id);
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.id}
          open={isOpen}
          onOpenChange={() => toggleSection(item.id)}
        >
          <CollapsibleTrigger
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-slate-800/40 rounded-lg transition-all duration-200 group ${
              level > 0 ? "pl-6" : ""
            }`}
          >
            <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
            <span className="flex-1 text-left font-medium text-slate-300 group-hover:text-slate-100">
              {item.label}
            </span>
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition-transform" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-2 mt-0.5 space-y-0.5 border-l border-slate-800/50 pl-1">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => setActiveItem(item.id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 group ${
          level > 0 ? "pl-6" : ""
        } ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 font-medium"
            : "hover:bg-slate-800/40 text-slate-300 hover:text-slate-100"
        }`}
      >
        <Icon
          className={`h-4 w-4 transition-colors ${
            isActive
              ? "text-white"
              : "text-slate-400 group-hover:text-slate-300"
          }`}
        />
        <span className="flex-1 text-left">{item.label}</span>
        {isActive && (
          <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        )}
      </button>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <RefreshCcw className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                Возвраты Яндекс Маркет
              </h1>
              <p className="text-xs text-slate-400">Управление возвратами</p>
            </div>
            <Badge
              variant="secondary"
              className="bg-slate-800/50 text-slate-300 border border-slate-700/50"
            >
              0
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-slate-800/50"
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-slate-800/50"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-slate-800/50 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-slate-800/50"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Separator
            orientation="vertical"
            className="mx-2 h-6 bg-slate-700/50"
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-800/50 h-9 px-3">
              <Moon className="h-4 w-4" />
              <span className="text-sm">Тема</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800">
              <DropdownMenuItem>Светлая</DropdownMenuItem>
              <DropdownMenuItem>Темная</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-800/50 h-9 px-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold">
                A
              </div>
              <span className="text-sm font-medium">admin</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800">
              <DropdownMenuItem>Профиль</DropdownMenuItem>
              <DropdownMenuItem>Выход</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-slate-800/50 text-red-400 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  integrator
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ERP Management System
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-0.5">
                {menuItems.map((item) => renderMenuItem(item))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-900/20">
          <RecordsTable />
        </main>
      </div>
    </div>
  );
}
