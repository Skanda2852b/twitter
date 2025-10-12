"use client";

import LanguageSelector from "@/components/LanguageSelector";
import { AuthProvider } from "@/context/AuthContext";

export default function LanguagePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Language Settings</h1>
          <LanguageSelector />
        </div>
      </div>
    </AuthProvider>
  );
}
