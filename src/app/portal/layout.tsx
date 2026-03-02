import { redirect } from "next/navigation";
import { requireSession } from "@/lib/get-session";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import PortalSidebar from "@/components/PortalSidebar";
import type { UserTier } from "@/types";

export const metadata = {
  title: "Member Portal — Ceardai",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;

  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  const userName = session.user.name || "Member";
  const userTier = ((session.user as Record<string, unknown>).tier as UserTier) || "consumer";

  let hasUsedInvite = false;
  if (userTier === "founder") {
    try {
      await connectDB();
      const founder = await Founder.findOne({ userId: session.user.id, isActive: true }).select("hasUsedInvite").lean();
      if (founder) {
        hasUsedInvite = (founder as { hasUsedInvite: boolean }).hasUsedInvite;
      }
    } catch {
      // ignore — default to not used
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <PortalSidebar userName={userName} userTier={userTier} hasUsedInvite={hasUsedInvite} />
      <div className="flex-1 bg-cream">
        {children}
      </div>
    </div>
  );
}
