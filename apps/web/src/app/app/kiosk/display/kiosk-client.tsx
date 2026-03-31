"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Monitor, UserCheck, XCircle, AlertCircle, Scan, Maximize, Settings, Save, X } from "lucide-react";
import { getAgentDiscovery, getLatestScan } from "./agent-action";

type KioskStatus = "idle" | "scanning" | "success" | "expired" | "not_found" | "error" | "banned" | "frozen";

export default function KioskDisplayClient({ 
  gymName = "GYMCENTRIX",
  branchId 
}: { 
  gymName?: string;
  branchId: string;
}) {
  const [status, setStatus] = useState<KioskStatus>("idle");
  const [memberName, setMemberName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agentConnected, setAgentConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [agentAddress, setAgentAddress] = useState("localhost:4010");
  const [showSettings, setShowSettings] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agentConnectedRef = useRef(false);
  const lastProcessedScanRef = useRef<string | null>(null);
  const lastRfidRef = useRef<string | null>(null);
  const lastRfidTimeRef = useRef<number>(0);

  const resetKiosk = useCallback(() => {
    setStatus("idle");
    setMemberName("");
    setErrorMessage("");
  }, []);

  // Sync ref for keyboard captures
  useEffect(() => { agentConnectedRef.current = agentConnected; }, [agentConnected]);

  useEffect(() => { 
    setMounted(true); 
    const savedAddress = localStorage.getItem("gx_agent_address");
    if (savedAddress) {
      setAgentAddress(savedAddress);
    } else {
      getAgentDiscovery(branchId).then(result => {
        if (result && "localIp" in result) {
          const discoveredAddress = `${result.localIp}:4010`;
          setAgentAddress(discoveredAddress);
          localStorage.setItem("gx_agent_address", discoveredAddress);
        }
      });
    }
  }, [branchId]);

  const handleCheckin = useCallback((payload: any) => {
    // 1. Deduplication
    const rfid = payload.tagId || payload.uid;
    const now = Date.now();
    
    if (rfid === lastRfidRef.current && (now - lastRfidTimeRef.current) < 3000) {
      return;
    }
    
    lastRfidRef.current = rfid;
    lastRfidTimeRef.current = now;

    // 2. Process Authoritative Result
    const { result, name, reason, error } = payload;

    if (result === "AUTHORIZED") {
      setStatus("success");
      setMemberName(name || "Member");
    } else if (result === "DENIED") {
      if (reason === "EXPIRED_MEMBERSHIP") {
        setStatus("expired");
        setMemberName(name || "Member");
      } else if (reason === "FROZEN_MEMBERSHIP") {
        setStatus("frozen");
        setMemberName(name || "Member");
      } else if (reason === "BANNED_MEMBER") {
        setStatus("banned");
        setMemberName(name || "Member");
      } else if (reason === "UNKNOWN_CARD") {
        setStatus("not_found");
      } else {
        setStatus("error");
        setErrorMessage(error || "Access Denied");
      }
    } else if (result === "SCANNING") {
      setStatus("scanning");
    } else {
      setStatus("error");
      setErrorMessage(error || "Synchronization Error");
    }

    // 3. Auto-Reset
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(resetKiosk, 3000);
  }, [resetKiosk]);

  // --- Cloud Relay Polling ---
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      try {
        const latest = await getLatestScan(branchId);
        
        if (latest && latest.lastScanId && latest.lastScanId !== lastProcessedScanRef.current) {
          lastProcessedScanRef.current = latest.lastScanId;
          
          try {
            const payload = JSON.parse(latest.lastScanId);
            handleCheckin(payload);
          } catch (e) {
            // Legacy/fallback fallback
            const tagId = latest.lastScanId.split("-")[0];
            handleCheckin({ tagId, result: "SCANNING" });
          }
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mounted, branchId, handleCheckin]);

  // --- WebSocket Listener (Local Sync) ---
  useEffect(() => {
    if (!mounted) return;

    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      const url = `ws://${agentAddress}`;
      socket = new WebSocket(url);

      socket.onopen = () => {
        setAgentConnected(true);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === "scan_success" || data.event === "checkin-result") {
            handleCheckin(data);
          } else if (data.event === "scan") {
            handleCheckin({ ...data, result: "SCANNING" });
          } else if (data.event === "scan_error") {
            handleCheckin({ ...data, result: "DENIED" });
          } else if (data.event === "scan_offline") {
            setStatus("error");
            setErrorMessage("Agent is offline (Check-in queued locally)");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(resetKiosk, 3000);
          }
        } catch (e) {
          console.error("WS error", e);
        }
      };

      socket.onclose = () => {
        setAgentConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        if (socket) socket.close();
      };
    };

    connect();

    // --- Keyboard Fallback ---
    let kbBuffer = "";
    let kbTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (agentConnectedRef.current) return;

      if (e.key === "Enter") {
        if (kbBuffer.length === 10) {
          // Keyboard fallback still needs to trigger a checkin because the hardware agent isn't doing it
          fetch("/api/kiosk/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rfid: kbBuffer, device_type: "kiosk" }),
          }).then(res => res.json()).then(handleCheckin);
        }
        kbBuffer = "";
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        kbBuffer += e.key;
        if (kbTimeout) clearTimeout(kbTimeout);
        kbTimeout = setTimeout(() => { kbBuffer = ""; }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (kbTimeout) clearTimeout(kbTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, agentAddress, handleCheckin, resetKiosk]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      suppressHydrationWarning
      className={`fixed inset-0 touch-none overscroll-none transition-colors duration-500 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-display ${
        !mounted ? "bg-[#0A0A0A]" :
        status === "idle" ? "bg-[#0A0A0A]" :
        status === "success" ? "bg-emerald-600" :
        status === "expired" ? "bg-amber-500" :
        status === "frozen" ? "bg-amber-700" :
        status === "not_found" ? "bg-rose-600" :
        status === "banned" ? "bg-rose-800" :
        status === "scanning" ? "bg-[#050505]" : "bg-rose-900"
      }`}
    >
      {!mounted ? null : (
        <>
          {/* Background Pulse */}
          <div className={`absolute inset-0 opacity-10 transition-opacity duration-1000 ${status !== "idle" ? 'opacity-20' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-[80vw] h-[80vw] rounded-full border-[10vw] border-white/10 ${status === "idle" ? "animate-pulse" : "scale-150 transition-transform duration-1000"}`} />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-6 md:space-y-12">
            {/* Status Icon */}
            <div className="relative">
              <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] bg-white/10 backdrop-blur-xl border flex items-center justify-center transition-all duration-500 ${
                status === "idle" || status === "scanning" ? "border-white/20" :
                status === "success" ? "border-emerald-400/50 scale-110 shadow-[0_0_100px_rgba(16,185,129,0.6)]" :
                status === "expired" || status === "frozen" ? "border-amber-400/50 scale-105 shadow-[0_0_80px_rgba(245,158,11,0.5)]" :
                "border-rose-400/50 scale-105 shadow-[0_0_80px_rgba(225,29,72,0.5)]"
              }`}>
                {status === "idle" && <Scan className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white/40 animate-pulse" />}
                {status === "scanning" && <Scan className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-primary animate-ping" />}
                {status === "success" && <UserCheck className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
                {status === "expired" && <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
                {status === "frozen" && <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
                {status === "not_found" && <XCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
                {status === "banned" && <XCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
                {status === "error" && <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" />}
              </div>
            </div>

            {/* Status Text */}
            <div className="space-y-2 md:space-y-4">
              <h1 className={`text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter transition-all duration-500 px-2 leading-none ${
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
              
              <p className="text-[10px] sm:text-lg md:text-2xl font-bold text-white/60 tracking-[0.2em] md:tracking-widest uppercase px-4">
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
              <div className="pt-8 md:pt-12 border-t border-white/10 w-full max-w-[200px] sm:max-w-md">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/20">
                  Biometric RFID Verification Nominal
                </p>
              </div>
            )}
          </div>

          {/* Fullscreen & Settings Buttons */}
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2 md:gap-3">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-40 md:opacity-20 hover:opacity-100"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={toggleFullScreen}
              className="hidden sm:flex p-3 md:p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-40 md:opacity-20 hover:opacity-100"
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/80 sm:bg-black/60 text-white">
              <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight">Kiosk Connectivity</h2>
                    <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Hardware Agent Address</label>
                        <input 
                          type="text" 
                          value={agentAddress}
                          onChange={(e) => setAgentAddress(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                        />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem("gx_agent_address", agentAddress);
                      setShowSettings(false);
                    }}
                    className="w-full bg-primary text-black font-bold py-4 rounded-xl"
                  >
                    Apply & Synchronize
                  </button>
              </div>
            </div>
          )}

          {/* Unified Header */}
          <div className="fixed top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-50 flex items-start justify-between pointer-events-none">
            <div className="hidden lg:flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity pointer-events-auto">
              <Image src="/app/gymcentrix-logo.png" alt="Logo" width={24} height={24} className="brightness-0 invert" />
              <span className="font-display font-bold text-white tracking-tighter text-lg uppercase">GYMCENTRIX</span>
            </div>

            <div className="flex-1 lg:flex-none flex flex-col items-center lg:items-end gap-1 opacity-60 md:opacity-20 hover:opacity-100 transition-opacity pointer-events-auto">
              <span className="font-display font-bold text-white tracking-widest text-[10px] md:text-sm uppercase text-center">{gymName}</span>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${agentConnected ? 'bg-emerald-500' : 'bg-primary'}`} />
                <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  {agentConnected ? "Local Sync Active" : "Cloud Relay Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Panel */}
          <div className="hidden sm:flex fixed bottom-8 left-8 flex-col gap-2 opacity-20 hover:opacity-100 transition-opacity">
            <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1 ml-1">Simulation Mode</p>
            <div className="flex gap-2">
              <button onClick={() => handleCheckin({ tagId: "1234567890", result: "AUTHORIZED", name: "Guest User" })} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-emerald-400 transition-all">Simulate Valid</button>
              <button onClick={() => handleCheckin({ tagId: "9999999999", result: "DENIED", reason: "UNKNOWN_CARD" })} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-rose-400 transition-all">Simulate Unknown</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
