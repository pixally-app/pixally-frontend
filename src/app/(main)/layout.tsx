import {
  Sidebar,
  SidebarProvider,
  PageHeader,
} from "@/components/layout/sidebar";
import { UserProvider } from "@/contexts/user-context";
import { WhatsAppProvider } from "@/contexts/whatsapp-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <WhatsAppProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6">
              <PageHeader />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </WhatsAppProvider>
    </UserProvider>
  );
}
