"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  RegisterState,
  defaultRegisterState,
  readRegisterState,
  writeRegisterState,
  clearRegisterState,
} from "@/lib/RegisterStore";

type Ctx = {
  state: RegisterState;
  setState: (updater: (prev: RegisterState) => RegisterState) => void;
  reset: () => void;
  hydrated: boolean;
};

const RegisterContext = createContext<Ctx | null>(null);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<RegisterState>(defaultRegisterState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStateInternal(readRegisterState());
    setHydrated(true);
  }, []);

  const setState = (updater: (prev: RegisterState) => RegisterState) => {
    setStateInternal((prev) => {
      const next = updater(prev);
      writeRegisterState(next);
      return next;
    });
  };

  const reset = () => {
    clearRegisterState();              // clear localStorage
    setStateInternal(defaultRegisterState); // clear React memory state
  };

  return (
    <RegisterContext.Provider value={{ state, setState, reset, hydrated }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error("useRegister must be used inside RegisterProvider");
  return ctx;
}
