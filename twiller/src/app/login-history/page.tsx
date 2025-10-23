// app/login-history/page.tsx
import SafeClientPage from '@/components/SafeClientPage';
import ClientLoginHistory from '@/components/ClientLoginHistory';

export default function LoginHistoryPage() {
  return (
    <SafeClientPage>
      <ClientLoginHistory />
    </SafeClientPage>
  );
}