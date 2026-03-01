import type { UserTier } from "@/types";

const tierStyles: Record<UserTier, { bg: string; text: string; label: string }> = {
  founder: { bg: "bg-gold/20", text: "text-gold", label: "Founder" },
  early_buyer: { bg: "bg-forest/10", text: "text-forest", label: "Early Buyer" },
  consumer: { bg: "bg-charcoal/10", text: "text-charcoal/70", label: "Consumer" },
  admin: { bg: "bg-amber/10", text: "text-amber", label: "Admin" },
};

export default function TierBadge({ tier }: { tier: UserTier }) {
  const style = tierStyles[tier] || tierStyles.consumer;

  return (
    <span
      className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-widest font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
