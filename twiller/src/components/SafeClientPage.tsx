// components/SafeClientPage.tsx
"use client";

import { ReactNode } from 'react';

interface SafeClientPageProps {
  children: ReactNode;
}

export default function SafeClientPage({ children }: SafeClientPageProps) {
  return <>{children}</>;
}