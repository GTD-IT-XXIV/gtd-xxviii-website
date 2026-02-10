export type Bundle = {
  id: string;
  name: string;
  description: string;
  priceText: string; // display only (no payment)
  amountCents: number;
};

export const BUNDLES: Bundle[] = [
  {
    id: "early",
    name: "Early Bird Bundle",
    description: "",
    priceText: "$42",
    amountCents: 50,
  },
  {
    id: "standard",
    name: "Standard Bundle",
    description: "",
    priceText: "$48",
    amountCents: 50,
  },
];

export type Slot = {
  id: string;
  label: string;
  dateText: string;
};

// Mock slots (replace with real availability later)
export const SLOTS: Slot[] = [
  { id: "slot-1", label: "10:00 – 12:00", dateText: "Sat, Feb 28" },
  { id: "slot-2", label: "11:30 – 13:30", dateText: "Sat, Feb 28" },
  { id: "slot-3", label: "13:00 – 15:00", dateText: "Sat, Feb 28" },
  { id: "slot-4", label: "14:30 – 16:30", dateText: "Sat, Feb 28" },
  { id: "slot-5", label: "16:00 – 18:00", dateText: "Sat, Feb 28" },
  { id: "slot-6", label: "17:30 – 19:30", dateText: "Sat, Feb 28" },
  { id: "slot-7", label: "19:00 – 21:00", dateText: "Sat, Feb 28" },
  { id: "slot-8", label: "20:30 – 22:30", dateText: "Sat, Feb 28" },
  { id: "slot-9", label: "10:00 – 12:00", dateText: "Sun, Mar 1" },
  { id: "slot-10", label: "11:05 – 13:05", dateText: "Sun, Mar 1" },
  { id: "slot-11", label: "14:15 – 16:15", dateText: "Sun, Mar 1" },
  { id: "slot-12", label: "15:20 – 17:20", dateText: "Sun, Mar 1" },
  { id: "slot-13", label: "16:25 – 18:25", dateText: "Sun, Mar 1" },
  { id: "slot-14", label: "17:30 – 19:30", dateText: "Sun, Mar 1" },
  { id: "slot-15", label: "18:35 – 20:35", dateText: "Sun, Mar 1" },
  { id: "slot-16", label: "19:40 – 21:40", dateText: "Sun, Mar 1" },
  { id: "slot-17", label: "20:45 – 22:45", dateText: "Sun, Mar 1" },
];