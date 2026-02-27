export interface SaleEvent {
  date: string; // YYYY-MM-DD
  beerId: string;
  timeWindow: string;
  status: "scheduled" | "active" | "completed";
}

export const saleEvents: SaleEvent[] = [
  {
    date: "2026-03-07",
    beerId: "bourbon-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-03-14",
    beerId: "moonlight-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-03-21",
    beerId: "crimson-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-03-28",
    beerId: "bourbon-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-04-04",
    beerId: "moonlight-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-04-11",
    beerId: "crimson-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-04-18",
    beerId: "bourbon-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
  {
    date: "2026-04-25",
    beerId: "moonlight-canvas",
    timeWindow: "10:00 – 14:00",
    status: "scheduled",
  },
];

export const pricing = [
  { item: "Single Bottle (330ml)", price: "€4.50" },
  { item: "4-Pack", price: "€16.00" },
  { item: "Crate (24 bottles)", price: "€85.00" },
  { item: "Mixed Crate (8 of each)", price: "€90.00" },
];
