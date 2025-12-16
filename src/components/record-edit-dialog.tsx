import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import type { ERPRecord } from "@/lib/supabase";
import { Save, X } from "lucide-react";

interface RecordEditDialogProps {
  record: ERPRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function RecordEditDialog({
  record,
  open,
  onOpenChange,
  onSave,
}: RecordEditDialogProps) {
  const [formData, setFormData] = useState<Partial<ERPRecord>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else {
      setFormData({
        record_number: "",
        order_number: "",
        record_date: new Date().toISOString().split("T")[0],
        record_type: "return",
        status: "pending",
        quantity: 0,
        amount: 0,
        counterparty: "",
        marketplace: "",
        product_name: "",
        category: "",
        warehouse: "",
        manager: "",
        priority: "normal",
        description: "",
        payment_status: "unpaid",
        delivery_method: "",
        is_urgent: false,
        is_processed: false,
      });
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (record?.id) {
        const { error } = await supabase
          .from("erp_records")
          .update(formData)
          .eq("id", record.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("erp_records")
          .insert([formData]);

        if (error) throw error;
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? "Редактировать запись" : "Новая запись"}
          </DialogTitle>
          <DialogDescription>
            Заполните все необходимые поля формы
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="record_number">Номер записи *</Label>
                <Input
                  id="record_number"
                  value={formData.record_number || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, record_number: e.target.value })
                  }
                  placeholder="RET-2024-001"
                  className="bg-slate-800/50 border-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_number">Номер заказа</Label>
                <Input
                  id="order_number"
                  value={formData.order_number || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, order_number: e.target.value })
                  }
                  placeholder="ORD-2024-123"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="record_date">Дата</Label>
                <Input
                  id="record_date"
                  type="date"
                  value={formData.record_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, record_date: e.target.value })
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="record_type">Тип записи</Label>
                <Select
                  value={formData.record_type || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, record_type: value || undefined })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return">Возврат</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                    <SelectItem value="purchase">Закупка</SelectItem>
                    <SelectItem value="transfer">Перемещение</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value || undefined })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидание</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                    <SelectItem value="cancelled">Отменено</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <Select
                  value={formData.priority || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value || undefined })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="urgent">Срочный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Сумма</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="counterparty">Контрагент</Label>
                <Input
                  id="counterparty"
                  value={formData.counterparty || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, counterparty: e.target.value })
                  }
                  placeholder="ООО Компания"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketplace">Маркетплейс</Label>
                <Select
                  value={formData.marketplace || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, marketplace: value || undefined })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ozon">OZON</SelectItem>
                    <SelectItem value="wildberries">Wildberries</SelectItem>
                    <SelectItem value="yandex">Яндекс Маркет</SelectItem>
                    <SelectItem value="aliexpress">AliExpress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_name">Наименование товара</Label>
              <Input
                id="product_name"
                value={formData.product_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
                placeholder="Название товара"
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Электроника"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">Склад</Label>
                <Input
                  id="warehouse"
                  value={formData.warehouse || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse: e.target.value })
                  }
                  placeholder="Склад №1"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Менеджер</Label>
                <Input
                  id="manager"
                  value={formData.manager || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, manager: e.target.value })
                  }
                  placeholder="Иванов И.И."
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_status">Статус оплаты</Label>
                <Select
                  value={formData.payment_status || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_status: value || undefined })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Не оплачено</SelectItem>
                    <SelectItem value="partially_paid">Частично оплачено</SelectItem>
                    <SelectItem value="paid">Оплачено</SelectItem>
                    <SelectItem value="refunded">Возврат средств</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_method">Способ доставки</Label>
              <Input
                id="delivery_method"
                value={formData.delivery_method || ""}
                onChange={(e) =>
                  setFormData({ ...formData, delivery_method: e.target.value })
                }
                placeholder="Курьер, Почта России, СДЭК"
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Дополнительная информация о записи"
                className="bg-slate-800/50 border-slate-700 min-h-[100px]"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_urgent"
                  checked={formData.is_urgent}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, is_urgent: checked })
                  }
                />
                <Label htmlFor="is_urgent" className="cursor-pointer">
                  Срочная запись
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_processed"
                  checked={formData.is_processed}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, is_processed: checked })
                  }
                />
                <Label htmlFor="is_processed" className="cursor-pointer">
                  Обработана
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 hover:bg-slate-800"
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
