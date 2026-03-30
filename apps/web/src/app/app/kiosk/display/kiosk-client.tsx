"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Monitor, UserCheck, XCircle, AlertCircle, Scan, Maximize } from "lucide-react";

type KioskStatus = "idle" | "scanning" | "success" | "expired" | "not_found" | "error" | "banned" | "frozen";

export default function KioskDisplayClient({ gymName = "GYMCENTRIX" }: { gymName?: string }) {
  const [status, setStatus] = useState<KioskStatus>("idle");
  const [memberName, setMemberName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agentConnected, setAgentConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agentConnectedRef = useRef(false);

  const resetKiosk = useCallback(() => {
    setStatus("idle");
    setMemberName("");
    setErrorMessage("");
  }, []);

  // Keep ref in sync with agentConnected so keyboard fallback always reads current value
  useEffect(() => { agentConnectedRef.current = agentConnected; }, [agentConnected]);

  // Mark as mounted so WebSocket-driven UI only renders client-side
  useEffect(() => { setMounted(true); }, []);

  const handleCheckin = useCallback(async (rfid: string) => {
    setStatus("scanning");
    try {
      const res = await fetch("/api/kiosk/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid, device_type: "kiosk" }),
      });

      const data = await res.json();

      if (data.result === "AUTHORIZED") {
        setStatus("success");
        setMemberName(data.name);
      } else if (data.result === "DENIED") {
        if (data.reason === "EXPIRED_MEMBERSHIP") {
          setStatus("expired");
          setMemberName(data.name || "Member");
        } else if (data.reason === "FROZEN_MEMBERSHIP") {
          setStatus("frozen");
        } else if (data.reason === "BANNED_MEMBER") {
          setStatus("banned");
        } else if (data.reason === "UNKNOWN_CARD") {
          setStatus("not_found");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Access Denied");
        }
      } else {
        setStatus("error");
        setErrorMessage(data.error || "System synchronization error");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network connectivity failure");
    }

    // Reset after 3 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(resetKiosk, 3000);
  }, [resetKiosk]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      ws = new WebSocket("ws://localhost:4010");

      ws.onopen = () => {
        setAgentConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === "scan") {
            setStatus("scanning");
          } else if (data.result === "AUTHORIZED") {
            setStatus("success");
            setMemberName(data.member?.name || data.name || "Member");
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(resetKiosk, 3000);
          } else if (data.result === "DENIED") {
             if (data.reason === "UNKNOWN_CARD") {
               setStatus("not_found");
             } else if (data.reason === "BANNED_MEMBER") {
               setStatus("banned");
             } else if (data.reason === "FROZEN_MEMBERSHIP") {
               setStatus("frozen");
             } else if (data.reason === "EXPIRED_MEMBERSHIP") {
               setStatus("expired");
             } else {
               setStatus("error");
               setErrorMessage(data.error || "Access Denied");
             }
             if (timeoutRef.current) clearTimeout(timeoutRef.current);
             timeoutRef.current = setTimeout(resetKiosk, 3000);
          } else if (data.event === "scan_offline") {
             setStatus("error");
             setErrorMessage("Agent is offline (Check-in queued locally)");
             if (timeoutRef.current) clearTimeout(timeoutRef.current);
             timeoutRef.current = setTimeout(resetKiosk, 3000);
          } else if (data.message === "heartbeat") {
             // Silence heartbeat, just used to keep tab alive
             return;
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };

      ws.onclose = () => {
        setAgentConnected(false);
        // Try to reconnect every 3 seconds if agent died or hasn't started
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
         ws.close();
      };
    };

    connectWebSocket();

    // --- Browser Keyboard Fallback ---
    // When the agent is disconnected / WinKeyServer.exe is unavailable,
    // the browser itself captures RFID keystrokes (reader must type into this tab).
    let kbBuffer = "";
    let kbTimeout: NodeJS.Timeout | null = null;
    const RFID_LENGTH = 10;
    const RFID_TIMEOUT_MS = 500;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if the agent is connected — it drives the kiosk
      if (agentConnectedRef.current) return;

      const digit = /^[0-9]$/.test(e.key) ? e.key : null;

      if (e.key === "Enter") {
        if (kbBuffer.length === RFID_LENGTH) {
          handleCheckin(kbBuffer);
        }
        kbBuffer = "";
        if (kbTimeout) clearTimeout(kbTimeout);
        return;
      }

      if (digit) {
        if (kbTimeout) clearTimeout(kbTimeout);
        kbBuffer += digit;
        // Auto-reset buffer after idle period (distinguishes scanner burst from human typing)
        kbTimeout = setTimeout(() => { kbBuffer = ""; }, RFID_TIMEOUT_MS);
      } else {
        // Non-digit resets buffer
        kbBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (kbTimeout) clearTimeout(kbTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resetKiosk, handleCheckin]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      suppressHydrationWarning 
      className={`fixed inset-0 touch-none overscroll-none transition-colors duration-500 flex flex-col items-center justify-center p-8 overflow-hidden font-display ${
        !mounted ? "bg-[#0A0A0A]" :
        status === "idle" ? "bg-[#0A0A0A]" :
        status === "success" ? "bg-emerald-600" :
        status === "expired" ? "bg-amber-500" :
        status === "frozen" ? "bg-amber-700" :
        status === "not_found" ? "bg-rose-600" :
        status === "banned" ? "bg-rose-800" :
        status === "scanning" ? "bg-[#111]" : "bg-rose-900"
      }`}
    >
      {/* Background Pulse */}
      <div className={`absolute inset-0 opacity-10 transition-opacity duration-1000 ${status !== "idle" ? 'opacity-20' : ''}`}>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-[80vw] h-[80vw] rounded-full border-[10vw] border-white/10 ${status === "idle" ? "animate-pulse" : "scale-150 transition-transform duration-1000"}`} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-12">
        {/* Status Icon */}
        <div className="relative">
          <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 ${
            status === "success" ? "scale-110 shadow-[0_0_100px_rgba(255,255,255,0.4)]" : ""
          }`}>
            {status === "idle" && <Scan className="w-16 h-16 md:w-24 md:h-24 text-white/40 animate-pulse" />}
            {status === "scanning" && <Scan className="w-16 h-16 md:w-24 md:h-24 text-primary animate-ping" />}
            {status === "success" && <UserCheck className="w-16 h-16 md:w-24 md:h-24 text-white" />}
            {status === "expired" && <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />}
            {status === "frozen" && <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />}
            {status === "not_found" && <XCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />}
            {status === "banned" && <XCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />}
            {status === "error" && <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />}
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-4">
          <h1 className={`text-4xl md:text-7xl font-black uppercase tracking-tighter transition-all duration-500 ${
            status === "success" ? "scale-105" : ""
          }`}>
            {status === "idle" && "Tap to Entry"}
            {status === "scanning" && "Validating..."}
            {status === "success" && memberName}
            {status === "expired" && "Membership Expired"}
            {status === "frozen" && "Account Frozen"}
            {status === "banned" && "Access Banned"}
            {status === "not_found" && "Account Not Found"}
            {status === "error" && "System Error"}
          </h1>
          
          <p className="text-lg md:text-2xl font-bold text-white/60 tracking-widest uppercase">
            {status === "idle" && "Gymcentrix Smart Access"}
            {status === "success" && "Access Granted • Welcome Back"}
            {status === "expired" && `${memberName} • Please see desk`}
            {status === "frozen" && "Contact Facility Manager"}
            {status === "banned" && "Access Revoked Profile Restriction"}
            {status === "not_found" && "Invalid Token Card"}
            {status === "error" && errorMessage}
          </p>
        </div>

        {/* Footer Instruction */}
        {status === "idle" && (
          <div className="pt-12 border-t border-white/10 w-full max-w-md">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              Biometric RFID Verification Nominal
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullScreen}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-20 hover:opacity-100"
      >
        <Maximize className="w-6 h-6" />
      </button>

      {/* Brand Watermark */}
      <div className="fixed top-8 left-8 flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
         <Image 
           src="/app/gymcentrix-logo.png" 
           alt="Logo" 
           width={24} 
           height={24} 
           className="brightness-0 invert" 
         />
         <span className="font-display font-bold text-white tracking-tighter text-lg uppercase">GYMCENTRIX</span>
      </div>

      {/* Gym Name top right */}
      <div 
        suppressHydrationWarning
        className="fixed top-8 right-8 opacity-20 hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
         <span className="font-display font-bold text-white tracking-widest text-md uppercase">{gymName}</span>
         {mounted && (
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${agentConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse'}`} />
             <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
               {agentConnected ? "Agent Connected" : "Agent Disconnected"}
             </span>
           </div>
         )}
      </div>

      {/* Simulation Panel for Testing */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-2 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1 ml-1">Simulation Mode</p>
        <div className="flex gap-2">
          <button 
            onClick={() => handleCheckin("1234567890")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/20 transition-all"
          >
            Simulate Valid Scan
          </button>
          <button 
            onClick={() => handleCheckin("9999999999")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-rose-400 hover:bg-rose-400/10 hover:border-rose-400/20 transition-all"
          >
            Simulate Unknown
          </button>
        </div>
      </div>
    </div>
  );
}
