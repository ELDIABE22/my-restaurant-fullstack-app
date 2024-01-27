"use client";

import { NextUIProvider } from "@nextui-org/react";

export function NextProviderUI({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
