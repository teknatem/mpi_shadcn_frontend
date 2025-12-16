import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import type { ERPRecord } from "@/lib/supabase";
import { RecordEditDialog } from "./record-edit-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit,
  Filter,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortField = keyof ERPRecord | null;
type SortDirection = "asc" | "desc";

export function RecordsTable() {
  const [records, setRecords] = useState<ERPRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ERPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [editingRecord, setEditingRecord] = useState<ERPRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("record_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [records, searchQuery, statusFilter, marketplaceFilter, sortField, sortDirection]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("erp_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...records];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.record_number.toLowerCase().includes(query) ||
          record.order_number?.toLowerCase().includes(query) ||
          record.product_name?.toLowerCase().includes(query) ||
          record.counterparty?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    if (marketplaceFilter !== "all") {
      filtered = filtered.filter(
        (record) => record.marketplace === marketplaceFilter
      );
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту запись?")) return;

    try {
      const { error } = await supabase
        .from("erp_records")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleEdit = (record: ERPRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedRecords.size === paginatedRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(paginatedRecords.map((r) => r.id)));
    }
  };

  const toggleSelectRecord = (id: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecords(newSelected);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30", label: "Ожидание" },
      processing: { color: "bg-blue-600/20 text-blue-400 border-blue-500/30", label: "В обработке" },
      completed: { color: "bg-green-600/20 text-green-400 border-green-500/30", label: "Завершено" },
      cancelled: { color: "bg-red-600/20 text-red-400 border-red-500/30", label: "Отменено" },
    };

    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.color} border`}>
        {variant.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      low: { color: "bg-slate-600/20 text-slate-400 border-slate-500/30", label: "Низкий" },
      normal: { color: "bg-blue-600/20 text-blue-400 border-blue-500/30", label: "Обычный" },
      high: { color: "bg-orange-600/20 text-orange-400 border-orange-500/30", label: "Высокий" },
      urgent: { color: "bg-red-600/20 text-red-400 border-red-500/30", label: "Срочный" },
    };

    const variant = variants[priority] || variants.normal;
    return (
      <Badge className={`${variant.color} border text-xs`}>
        {variant.label}
      </Badge>
    );
  };

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const totalAmount = filteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalQuantity = filteredRecords.reduce((sum, r) => sum + (r.quantity || 0), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleNew}
              className="gap-2 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              Создать
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchRecords}
              className="gap-2 border-slate-700/50 hover:bg-slate-800/50"
            >
              <RefreshCcw className="h-4 w-4" />
              Обновить
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/20"
            >
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск по записям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-slate-800/50 border-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>

            <Select value={marketplaceFilter} onValueChange={(value) => setMarketplaceFilter(value || "all")}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все маркетплейсы</SelectItem>
                <SelectItem value="ozon">OZON</SelectItem>
                <SelectItem value="wildberries">Wildberries</SelectItem>
                <SelectItem value="yandex">Яндекс Маркет</SelectItem>
                <SelectItem value="aliexpress">AliExpress</SelectItem>
              </SelectContent>
            </Select>

            {(statusFilter !== "all" || marketplaceFilter !== "all" || searchQuery) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setMarketplaceFilter("all");
                  setSearchQuery("");
                }}
                className="text-slate-400 hover:text-slate-100"
              >
                Сбросить фильтры
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
              <span className="text-sm font-medium">
                {currentPage} / {totalPages || 1} ({filteredRecords.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value || "50"));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8 bg-slate-800/50 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <RefreshCcw className="h-8 w-8 text-blue-400 animate-spin" />
              <p className="text-slate-400">Загрузка данных...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-slate-900/95 backdrop-blur-sm shadow-lg z-10">
              <TableRow className="border-slate-800/60 hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedRecords.length > 0 &&
                      selectedRecords.size === paginatedRecords.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-slate-300">
                  <button
                    onClick={() => handleSort("record_date")}
                    className="flex items-center gap-1 hover:text-slate-100 transition-colors"
                  >
                    Дата
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-slate-300">
                  <button
                    onClick={() => handleSort("record_number")}
                    className="flex items-center gap-1 hover:text-slate-100 transition-colors"
                  >
                    Номер записи
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-slate-300">
                  Номер заказа
                </TableHead>
                <TableHead className="font-semibold text-slate-300">Товар</TableHead>
                <TableHead className="font-semibold text-slate-300">
                  Маркетплейс
                </TableHead>
                <TableHead className="font-semibold text-slate-300">
                  Статус
                </TableHead>
                <TableHead className="font-semibold text-slate-300">
                  Приоритет
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-300">
                  Кол-во
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-300">
                  Сумма
                </TableHead>
                <TableHead className="w-24 text-center">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-800/30 rounded-full">
                        <AlertCircle className="h-8 w-8 text-slate-500" />
                      </div>
                      <div>
                        <p className="mb-1 text-base font-medium text-slate-300">
                          Записей не найдено
                        </p>
                        <p className="text-sm text-slate-500">
                          Попробуйте изменить параметры поиска или создайте новую запись
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    className="hover:bg-slate-800/30 border-slate-800/40"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRecords.has(record.id)}
                        onCheckedChange={() => toggleSelectRecord(record.id)}
                      />
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(record.record_date).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        {record.record_number}
                        {record.is_urgent && (
                          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {record.order_number || "-"}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-[200px] truncate">
                      {record.product_name || "-"}
                    </TableCell>
                    <TableCell>
                      {record.marketplace ? (
                        <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                          {record.marketplace}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{getPriorityBadge(record.priority)}</TableCell>
                    <TableCell className="text-right text-slate-300">
                      {record.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-200">
                      {record.amount.toLocaleString("ru-RU", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(record)}
                          className="h-8 w-8 hover:bg-slate-700"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          className="h-8 w-8 hover:bg-red-900/20 text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="border-t border-slate-800/60 bg-slate-900/60 backdrop-blur-sm px-4 py-2.5 shadow-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Записей:{" "}
              <span className="font-semibold text-slate-300">
                {filteredRecords.length}
              </span>
            </span>
            {selectedRecords.size > 0 && (
              <span className="text-slate-400">
                Выбрано:{" "}
                <span className="font-semibold text-blue-400">
                  {selectedRecords.size}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Количество:{" "}
              <span className="font-semibold text-slate-300">
                {totalQuantity}
              </span>
            </span>
            <span className="text-slate-400">
              Сумма:{" "}
              <span className="font-semibold text-slate-300">
                {totalAmount.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </span>
          </div>
        </div>
      </div>

      <RecordEditDialog
        record={editingRecord}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={fetchRecords}
      />
    </div>
  );
}
