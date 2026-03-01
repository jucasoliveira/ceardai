import type { BatchStatus } from "@/types";

const statusConfig: Record<
  BatchStatus,
  { label: string; className: string }
> = {
  announced: {
    label: "Announced",
    className: "bg-amber",
  },
  early_access: {
    label: "Early Access",
    className: "bg-forest",
  },
  live: {
    label: "Live",
    className: "bg-green-600",
  },
  sold_out: {
    label: "Sold Out",
    className: "bg-burgundy",
  },
  completed: {
    label: "Completed",
    className: "bg-charcoal/40",
  },
};

interface StatusBadgeProps {
  status: BatchStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide text-white uppercase ${config.className}`}
    >
      {config.label}
    </span>
  );
}
