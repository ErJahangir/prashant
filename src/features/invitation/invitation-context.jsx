import { createContext, useContext, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInvitation } from "@/services/api";
import {
  getWeddingUid,
  storeWeddingUid,
  storeGuestName,
} from "@/lib/invitation-storage";
import { safeBase64 } from "@/lib/base64";

const InvitationContext = createContext(null);

export function InvitationProvider({ children }) {
  const location = useLocation();

  // 🔒 Freeze UID forever (prevents refetch loop)
  const uidRef = useRef(null);

  const invitationUid = useMemo(() => {
    if (uidRef.current !== null) return uidRef.current;

    let uidFromUrl = null;

    const pathSegments = location.pathname.split("/").filter(Boolean);

    // /invitation/uid
    if (pathSegments.length >= 2 && pathSegments[0] === "invitation") {
      uidFromUrl = pathSegments[1];
    }
    // /uid
    else if (pathSegments.length > 0) {
      uidFromUrl = pathSegments[0];
    }

    // ?uid=...
    if (!uidFromUrl) {
      const params = new URLSearchParams(location.search);
      uidFromUrl = params.get("uid");
    }

    const storedUid = getWeddingUid();

    const finalUid =
      uidFromUrl || storedUid || import.meta.env.VITE_INVITATION_UID || null;

    if (finalUid) storeWeddingUid(finalUid);

    uidRef.current = finalUid; // 🚀 LOCK UID
    return finalUid;
  }, []);

  // Store guest name only (NO navigation here)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const guestParam = params.get("guest");

    if (!guestParam) return;

    try {
      const decoded = safeBase64.decode(guestParam);
      if (decoded) storeGuestName(decoded);
    } catch (err) {
      console.error("Guest decode failed:", err);
    }
  }, [location.search]);

  // 🚀 React Query — stable single fetch
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invitation", invitationUid],
    queryFn: async () => {
      const response = await fetchInvitation(invitationUid);
      if (response.success) return response.data;
      throw new Error(response.error || "Failed to load invitation");
    },
    enabled: !!invitationUid,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <InvitationContext.Provider
      value={{
        uid: invitationUid,
        config,
        isLoading,
        error: error?.message,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const context = useContext(InvitationContext);
  if (!context)
    throw new Error("useInvitation must be used within InvitationProvider");
  return context;
}
