// app/bookmarks/page.tsx
import SafeClientPage from '@/components/SafeClientPage';
import ClientBookmarks from '@/components/ClientBookmarks';

export default function BookmarksPage() {
  return (
    <SafeClientPage>
      <ClientBookmarks />
    </SafeClientPage>
  );
}