"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface SSEEvent {
  event: string;
  data: any;
}

interface UseSSEOptions {
  onNotification?: (data: any) => void;
  onTeamUpdated?: (data: any) => void;
  onConnected?: (data: any) => void;
  onHeartbeat?: (data: any) => void;
  onAdminStats?: (data: any) => void;
  onError?: (error: Event) => void;
}

export function useSSE(options: UseSSEOptions = {}) {
  const { token } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const isManualClose = useRef(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const getApiBase = useCallback(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !token) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const baseUrl = getApiBase();
    const sseUrl = `${baseUrl}/api/events/stream?token=${token}`;

    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      reconnectAttempts.current = 0;
    };

    eventSource.addEventListener("connected", (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onConnected?.(data);
      } catch {}
    });

    eventSource.addEventListener("notification", (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onNotification?.(data);
      } catch {}
    });

    eventSource.addEventListener("team_updated", (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onTeamUpdated?.(data);
      } catch {}
    });

    eventSource.addEventListener("heartbeat", (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onHeartbeat?.(data);
      } catch {}
    });

    eventSource.addEventListener("admin_stats", (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onAdminStats?.(data);
      } catch {}
    });

    // Fallback for untyped events
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        optionsRef.current.onNotification?.(data);
      } catch {}
    };

    eventSource.onerror = (e) => {
      optionsRef.current.onError?.(e);

      if (isManualClose.current) return;

      eventSource.close();

      // Exponential backoff reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;

        reconnectTimeoutRef.current = setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          connect();
        }, delay);
      }
    };

    eventSourceRef.current = eventSource;
  }, [token, getApiBase]); // Removed options from deps

  const disconnect = useCallback(() => {
    isManualClose.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    reconnectAttempts.current = 0;
  }, []);

  useEffect(() => {
    isManualClose.current = false;
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connect, disconnect };
}
