import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  unpaid: { label: "Belum Bayar", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  pending_verification: { label: "Verifikasi", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  paid: { label: "Lunas", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  todo: { label: "To Do", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  in_progress: { label: "Proses", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  done: { label: "Selesai", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  active: { label: "Aktif", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  inactive: { label: "Nonaktif", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  low: { label: "Rendah", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  medium: { label: "Sedang", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  high: { label: "Tinggi", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  };

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
