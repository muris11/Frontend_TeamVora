"use client";

import { useEffect, useRef } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { toast } from "sonner";

export function PushNotificationSetup() {
  const initialized = useRef(false);

  useEffect(() => {
    // Make sure we are in browser and Service Workers are supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator && !initialized.current) {
      initialized.current = true;
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: "ebc45fe3-d03d-4b77-a474-1a3e83030c84",
      });

      beamsClient
        .start()
        .then(() => beamsClient.addDeviceInterest("hello"))
        .then(() => console.log("Successfully registered and subscribed to Beams!"))
        .catch((e) => {
          console.error("Push Notification Error:", e);
          if (e.message && e.message.includes("User denied permission")) {
            toast.error("Notifikasi Diblokir Browser", {
              description: "Anda menolak akses notifikasi. Silakan klik ikon gembok di URL bar browser Anda, dan izinkan Notifikasi untuk menerima pemberitahuan dari TeamVora.",
              duration: 8000,
            });
          }
        });
    }
  }, []);

  return null;
}
