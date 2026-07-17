"use client";

import * as React from "react";
import { getZapfyStatus } from "@/services/zapfy";

interface WhatsAppContextValue {
  isConnected: boolean;
  connectedAt: string | null;
  loading: boolean;
  refreshStatus: () => Promise<void>;
}

const WhatsAppContext = React.createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectedAt, setConnectedAt] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshStatus = React.useCallback(async () => {
    try {
      const data = await getZapfyStatus();
      const connected = data.active && data.state === "connected";
      setIsConnected(connected);
      setConnectedAt(data.connectedAt);
    } catch {
      setIsConnected(false);
    }
  }, []);

  React.useEffect(() => {
    refreshStatus().finally(() => setLoading(false));
  }, [refreshStatus]);

  const value = React.useMemo(
    () => ({ isConnected, connectedAt, loading, refreshStatus }),
    [isConnected, connectedAt, loading, refreshStatus]
  );

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const ctx = React.useContext(WhatsAppContext);
  if (!ctx) throw new Error("useWhatsApp must be used within WhatsAppProvider");
  return ctx;
}
