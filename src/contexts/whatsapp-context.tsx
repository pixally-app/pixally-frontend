"use client";

import * as React from "react";
import { getZapfyStatus } from "@/services/zapfy";

interface WhatsAppContextValue {
  isConnected: boolean;
  connectedAt: string | null;
  loading: boolean;
  statusError: string | null;
  refreshStatus: () => Promise<void>;
}

const WhatsAppContext = React.createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectedAt, setConnectedAt] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [statusError, setStatusError] = React.useState<string | null>(null);

  const refreshStatus = React.useCallback(async () => {
    const data = await getZapfyStatus();
    const connected = data.active && data.state === "connected";
    setIsConnected(connected);
    setConnectedAt(data.connectedAt);
    setStatusError(null);
  }, []);

  React.useEffect(() => {
    refreshStatus()
      .catch((err) => {
        setIsConnected(false);
        setStatusError(err instanceof Error ? err.message : "Erro ao verificar status.");
      })
      .finally(() => setLoading(false));
  }, [refreshStatus]);

  const value = React.useMemo(
    () => ({ isConnected, connectedAt, loading, statusError, refreshStatus }),
    [isConnected, connectedAt, loading, statusError, refreshStatus]
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
