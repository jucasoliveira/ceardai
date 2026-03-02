export type BatchStatus =
  | "announced"
  | "early_access"
  | "live"
  | "sold_out"
  | "completed";

export type UserTier = "consumer" | "early_buyer" | "founder" | "admin";

export type OrderStatus = "pending" | "confirmed" | "collected" | "cancelled";

export type DeliveryMethod = "pickup" | "delivery";

export type VoteStatus = "open" | "closed" | "tallied";

export type MessageStatus = "unread" | "read" | "replied";

export interface BatchSummary {
  _id: string;
  batchNumber: number;
  beerId: string;
  beerName: string;
  beerColor: string;
  totalBottles: number;
  bottlesRemaining: number;
  pricePerBottle: number;
  earlyAccessFee: number;
  status: BatchStatus;
  announcedAt: string;
  earlyAccessOpensAt: string;
  liveSaleOpensAt: string;
  saleEndsAt: string;
  description: string;
  isVotingBatch: boolean;
}

export interface OrderSummary {
  _id: string;
  userId: string;
  batchId: string;
  batchNumber: number;
  beerName: string;
  quantity: number;
  totalAmount: number;
  tierAtPurchase: UserTier;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  createdAt: string;
}

export type InviteStatus = "pending" | "sent" | "accepted";

export type WaitingListStatus = "waiting" | "promoted" | "expired";

export interface FounderSummary {
  _id: string;
  userId: string;
  name: string;
  email: string;
  spotNumber: number;
  allocationPerBatch: number;
  isActive: boolean;
  inviteStatus: InviteStatus;
  hasUsedInvite: boolean;
}

export interface WaitingListEntry {
  _id: string;
  name: string;
  email: string;
  invitedBy: string | null;
  status: WaitingListStatus;
  createdAt: string;
}

export interface VoteSummary {
  _id: string;
  title: string;
  options: VoteOption[];
  status: VoteStatus;
  opensAt: string;
  closesAt: string;
}

export interface VoteOption {
  id: string;
  label: string;
  description: string;
  votes: number;
}

export interface MessageSummary {
  _id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: MessageStatus;
  adminReply?: string;
  createdAt: string;
}

export interface AdminStats {
  totalMembers: number;
  totalFounders: number;
  activeBatch: BatchSummary | null;
  unreadMessages: number;
  recentOrders: OrderSummary[];
}
