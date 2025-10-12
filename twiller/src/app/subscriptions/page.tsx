"use client";

import SubscriptionPlans from "@/components/SubscriptionPlans";
import { AuthProvider } from "@/context/AuthContext";

export default function SubscriptionsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
          <SubscriptionPlans />
        </div>
      </div>
    </AuthProvider>
  );
}
