// components/ClientLoginHistory.tsx
"use client";

import { useAuth } from '../context/AuthContext';

export default function ClientLoginHistory() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login History</h1>
          <p className="text-gray-600 mb-4">Please sign in to view your login history</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login History</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your login history will appear here.</p>
        </div>
      </div>
    </div>
  );
}