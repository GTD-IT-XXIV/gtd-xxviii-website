import { RegisterState } from "@/lib/RegisterStore";

export function canGoDetails(state: RegisterState) {
  return Boolean(state.bundleId);
}

export function canGoSlot(state: RegisterState) {
  return Boolean(state.bundleId && state.details);
}

export function canGoConfirm(state: RegisterState) {
  return Boolean(state.bundleId && state.details && state.slotId);
}
