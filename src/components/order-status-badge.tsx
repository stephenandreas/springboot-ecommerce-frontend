import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus, SubOrderStatus } from "@/types";

const LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Dibayar",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  EXPIRED: "Kedaluwarsa",
  PENDING: "Menunggu Konfirmasi",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DELIVERED: "Terkirim",
  DONE: "Selesai",
};

const STYLES: Record<string, string> = {
  PAID: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  SHIPPED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus | SubOrderStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", STYLES[status])}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
