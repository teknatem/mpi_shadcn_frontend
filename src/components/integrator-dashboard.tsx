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
  User,
  LogOut,
  Bell,
  Columns,
  BarChart3,
  Filter,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          {/* Toolbar */}
          <div className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-2 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Обновить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-700/50 hover:bg-slate-800/50"
                >
                  <span>Post (0)</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-700/50 hover:bg-slate-800/50"
                >
                  <span>Unpost (0)</span>
                </Button>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-slate-700/50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/20 hover:border-emerald-600/50"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-700/50 hover:bg-slate-800/50"
                >
                  <Filter className="h-4 w-4" />
                  Фильтры
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  >
                    2
                  </Badge>
                </Button>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-800/50"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-800/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
                  <span className="text-sm font-medium">1 / 1 (0)</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-800/50"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-800/50"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                <select className="h-8 px-3 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option>100</option>
                  <option>50</option>
                  <option>25</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 overflow-auto bg-slate-900/30">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm shadow-lg z-10">
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-800/50"
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-300">
                      <button className="flex items-center gap-1 hover:text-slate-100 transition-colors">
                        Дата
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-300">
                      <button className="flex items-center gap-1 hover:text-slate-100 transition-colors">
                        Return №
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-300">
                      <button className="flex items-center gap-1 hover:text-slate-100 transition-colors">
                        Order №
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-300">
                      <button className="flex items-center gap-1 hover:text-slate-100 transition-colors">
                        Тип
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-300">
                      <button className="flex items-center gap-1 hover:text-slate-100 transition-colors">
                        Статус
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-300">
                      Шт.
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-300">
                      Сумма
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-slate-800/30">
                    <TableCell
                      colSpan={9}
                      className="text-center text-slate-400 py-16"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-800/30 rounded-full">
                          <FileText className="h-8 w-8 text-slate-500" />
                        </div>
                        <div>
                          <p className="mb-1 text-base font-medium text-slate-300">
                            Записей: 0
                          </p>
                          <p className="text-sm text-slate-500">
                            Возвр: 0 / Невыкс: 0
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="border-t border-slate-800/60 bg-slate-900/60 backdrop-blur-sm px-4 py-2.5 shadow-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">
                      Записей:{" "}
                      <span className="font-semibold text-slate-300">0</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">
                      Количество:{" "}
                      <span className="font-semibold text-slate-300">0</span>
                    </span>
                    <span className="text-slate-400">
                      Сумма:{" "}
                      <span className="font-semibold text-slate-300">
                        -0.00
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Logs */}
            <aside className="w-96 border-l border-slate-800/60 bg-slate-900/40 backdrop-blur-sm flex flex-col shadow-2xl">
              <div className="border-b border-slate-800/60 p-4 bg-slate-900/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-600/10 rounded-md border border-purple-500/20">
                      <FileText className="h-4 w-4 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-100">
                      Логи системы
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-slate-800/50"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-slate-800/50 text-red-400 hover:text-red-300"
                    >
                      Очистить
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
                    <TableRow className="border-slate-800/60">
                      <TableHead className="w-24 text-xs font-semibold text-slate-400">
                        Время
                      </TableHead>
                      <TableHead className="w-28 text-xs font-semibold text-slate-400">
                        Источник
                      </TableHead>
                      <TableHead className="w-28 text-xs font-semibold text-slate-400">
                        Категория
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400">
                        Сообщение
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-slate-800/20">
                      <TableCell
                        colSpan={4}
                        className="text-center text-slate-400 py-12"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-slate-800/30 rounded-full">
                            <FileText className="h-6 w-6 text-slate-500" />
                          </div>
                          <p className="text-sm">Логов пока нет</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
