"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  Bell,
  MessageCircle,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  indicator?: "success";
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Comprovantes", href: "/receipts", icon: Receipt },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Contas a Receber", href: "/receivables", icon: Wallet },
  { label: "Alertas", href: "/alerts", icon: Bell, badge: 3 },
  {
    label: "WhatsApp",
    href: "/whatsapp",
    icon: MessageCircle,
    indicator: "success",
  },
  { label: "Configurações", href: "/settings", icon: Settings },
];

const bottomNavItem: NavItem = {
  label: "Sair",
  href: "/login",
  icon: LogOut,
};

function SidebarHeader() {
  return (
    <div className="flex items-center gap-2.5 px-6 py-5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9.2 24.01C11.745 25.316 14.672 25.67 17.455 25.007C20.237 24.346 22.691 22.712 24.376 20.4C26.06 18.088 26.863 15.251 26.641 12.4C26.418 9.549 25.185 6.87 23.162 4.848C21.14 2.826 18.462 1.592 15.611 1.37C12.759 1.147 9.922 1.95 7.61 3.635C5.299 5.319 3.665 7.773 3.003 10.556C2.341 13.338 2.695 16.266 4 18.81L1.333 26.677L9.2 24.01Z"
          stroke="var(--sidebar-primary)"
          strokeWidth="2.667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-bold text-sidebar-foreground">Pixally</span>
    </div>
  );
}

function SidebarNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "border-l-4 border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
          : "border-l-4 border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>

      {item.badge != null && item.badge > 0 && (
        <Badge
          variant="destructive"
          className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[11px]"
        >
          {item.badge}
        </Badge>
      )}

      {item.indicator === "success" && (
        <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
      )}
    </Link>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-sidebar-border px-6 py-4">
      <p className="text-xs text-muted-foreground">Sistema Pixally v1.0</p>
      <p className="text-xs text-muted-foreground">
        &copy; 2026 Todos os direitos reservados
      </p>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-sidebar flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarHeader />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {mainNavItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
          />
        ))}

        <div className="mt-auto border-t border-sidebar-border pt-2">
          <SidebarNavItem
            item={bottomNavItem}
            isActive={false}
          />
        </div>
      </nav>

      <SidebarFooter />
    </aside>
  );
}
