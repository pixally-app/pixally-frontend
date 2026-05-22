"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { warnings } from "@/data/mock-alerts";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wallet,
  Bell,
  MessageCircle,
  Settings,
  LogOut,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  indicator?: "success";
}

interface SidebarContextProps {
  open: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const rawIsMobile = useIsMobile();
  const isMobile = rawIsMobile ?? false;
  const [open, setOpen] = React.useState(true);
  const hasUserToggled = React.useRef(false);

  const toggleSidebar = React.useCallback(() => {
    hasUserToggled.current = true;
    setOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (rawIsMobile === undefined) return;
    if (hasUserToggled.current) {
      hasUserToggled.current = false;
      return;
    }
    setOpen(!rawIsMobile);
  }, [rawIsMobile]);

  const value = React.useMemo(
    () => ({ open, toggleSidebar, isMobile }),
    [open, toggleSidebar, isMobile]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Comprovantes", href: "/receipts", icon: Receipt },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Contas a Receber", href: "/receivables", icon: Wallet },
  { label: "Alertas", href: "/alerts", icon: Bell, badge: warnings.filter((w) => !w.resolved).length },
  {
    label: "WhatsApp",
    href: "/whatsapp",
    icon: MessageCircle,
    indicator: "success",
  },
  { label: "Configurações", href: "/settings", icon: Settings },
];


const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/receipts": "Comprovantes",
  "/clients": "Clientes",
  "/receivables": "Contas a Receber",
  "/alerts": "Alertas",
  "/whatsapp": "WhatsApp",
  "/settings": "Configurações",
};

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  for (const [route, title] of Object.entries(pageTitles)) {
    if (pathname === route || pathname.startsWith(route + "/")) return title;
  }
  return "Pixally";
}
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

function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
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

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    deleteCookie("access_token");
    router.push("/login");
  }

  return (
    <>
      <SidebarHeader />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {mainNavItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            onClick={onNavClick}
          />
        ))}

        <div className="mt-auto border-t border-sidebar-border pt-2">
          <button
            onClick={() => {
              handleLogout();
              onNavClick?.();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors border-l-4 border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="flex-1 truncate text-left">Sair</span>
          </button>
        </div>
      </nav>

      <SidebarFooter />
    </>
  );
}

function PageHeader() {
  const { open, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <div className="flex items-center gap-2 mb-4 md:mb-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-accent cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </div>
  );
}

export function Sidebar() {
  const { open, isMobile, toggleSidebar } = useSidebar();

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={toggleSidebar}
          />
        )}
        <aside
          aria-hidden={!open}
          inert={!open ? true : undefined}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-sidebar flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-linear",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent onNavClick={toggleSidebar} />
        </aside>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "shrink-0 transition-[width] duration-200 ease-linear",
          open ? "w-sidebar" : "w-0"
        )}
      />
      <aside
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-sidebar flex-col border-r border-sidebar-border bg-sidebar transition-[left] duration-200 ease-linear",
          !open && "left-[calc(var(--sidebar-width)*-1)]"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export { PageHeader };
