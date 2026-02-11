import { BUNDLES, SLOTS } from "./RegisterData";

export type BookingDetails = {
  groupName: string;
  captainName: string;
  email: string;
  phone: string;
  telegram: string
  member1: string;
  member2: string;
  member3: string;
  member4?: string; //optional
  member5?: string; // optional
};

export type RegisterState = {
  bundleId: string | null;
  details: BookingDetails | null;
  slotId: string | null;
};

// bump version so old storage doesn't conflict
const KEY = "register_state_v2";

export const defaultRegisterState: RegisterState = {
  bundleId: null,
  details: null,
  slotId: null,
};

function isNonEmptyString(x: unknown) {
  return typeof x === "string";
}

function coerceDetails(details: any): BookingDetails | null {
  if (!details || typeof details !== "object") return null;

  // NEW shape
  const hasNew =
    "groupName" in details ||
    "captainName" in details ||
    "member1" in details ||
    "member2" in details ||
    "member3" in details;

  if (hasNew) {
    return {
      groupName: isNonEmptyString(details.groupName) ? details.groupName : "",
      captainName: isNonEmptyString(details.captainName) ? details.captainName : "",
      email: isNonEmptyString(details.email) ? details.email : "",
      phone: isNonEmptyString(details.phone) ? details.phone : "",
      telegram: isNonEmptyString(details.telegram) ? details.telegram : "",
      member1: isNonEmptyString(details.member1) ? details.member1 : "",
      member2: isNonEmptyString(details.member2) ? details.member2 : "",
      member3: isNonEmptyString(details.member3) ? details.member3 : "",
      member4: isNonEmptyString(details.member4) ? details.member4 : undefined,
      member5: isNonEmptyString(details.member5) ? details.member5 : undefined,
    };
  }

  // OLD shape migration: { fullName, email, phone }
  // Map fullName -> captainName, rest empty
  if ("fullName" in details || "email" in details || "phone" in details) {
    return {
      groupName: "",
      captainName: isNonEmptyString(details.fullName) ? details.fullName : "",
      email: isNonEmptyString(details.email) ? details.email : "",
      phone: isNonEmptyString(details.phone) ? details.phone : "",
      telegram: isNonEmptyString(details.telegram) ? details.telegram : "",
      member1: "",
      member2: "",
      member3: "",
      member4: undefined,
      member5: undefined,
    };
  }

  return null;
}

export function readRegisterState(): RegisterState {
  if (typeof window === "undefined") return defaultRegisterState;

  try {
    const raw = window.localStorage.getItem(KEY);

    // Optional: also try reading v1 once, then rewrite into v2
    const rawV1 = !raw ? window.localStorage.getItem("register_state_v1") : null;

    const source = raw ?? rawV1;
    if (!source) return defaultRegisterState;

    const parsed = JSON.parse(source) as any;

    const next: RegisterState = {
      bundleId: typeof parsed.bundleId === "string" ? parsed.bundleId : null,
      details: coerceDetails(parsed.details),
      slotId: typeof parsed.slotId === "string" ? parsed.slotId : null,
    };

    // If we loaded from v1, upgrade storage to v2 so next load is clean
    if (!raw && rawV1) {
      writeRegisterState(next);
      // optionally clear v1
      window.localStorage.removeItem("register_state_v1");
    }

    return next;
  } catch {
    return defaultRegisterState;
  }
}

export function writeRegisterState(next: RegisterState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearRegisterState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  // also clear old key if it exists
  window.localStorage.removeItem("register_state_v1");
}

// Helpers to display summary
export function getBundle(bundleId: string | null) {
  return BUNDLES.find((b) => b.id === bundleId) ?? null;
}

export function getSlot(slotId: string | null) {
  return SLOTS.find((s) => s.id === slotId) ?? null;
}
