// app/settings/page.tsx
import SafeClientPage from "@/components/SafeClientPage";
import ClientSettings from "@/components/ClientSettings";

export default function SettingsPage() {
  return (
    <SafeClientPage>
      <ClientSettings />
    </SafeClientPage>
  );
}
