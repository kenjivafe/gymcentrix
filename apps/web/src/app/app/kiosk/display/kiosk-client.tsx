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

  const resetKiosk = useCallback(() => {
    setStatus("idle");
    setMemberName("");
    setErrorMessage("");
  }, []);

  // Keep ref in sync with agentConnected so keyboard fallback always reads current value
  useEffect(() => { agentConnectedRef.current = agentConnected; }, [agentConnected]);

  // Mark as mounted and handle autonomous agent discovery
  useEffect(() => { 
    setMounted(true); 
    
    const savedAddress = localStorage.getItem("gx_agent_address");
    if (savedAddress) {
      setAgentAddress(savedAddress);
    } else {
      // If no manual address is set, try to discover the agent automatically
      getAgentDiscovery(branchId).then(result => {
        if (result && "localIp" in result) {
          const discoveredAddress = `${result.localIp}:4010`;
          setAgentAddress(discoveredAddress);
          localStorage.setItem("gx_agent_address", discoveredAddress);
        }
      });
    }
  }, [branchId]);

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

  // --- Cloud Relay Polling ---
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      try {
        const scanData = await getLatestScan(branchId);

        if (scanData && scanData.scanId) {
          if (lastProcessedScanRef.current !== scanData.scanId) {
            if (lastProcessedScanRef.current === null) {
              lastProcessedScanRef.current = scanData.scanId;
              return;
            }
            lastProcessedScanRef.current = scanData.scanId;
            const tagId = scanData.scanId.split("-")[0];
            if (tagId) {
               console.log("Global Capture: Received scan from cloud", tagId);
               handleCheckin(tagId);
            }
          }
        } else if (scanData === null && lastProcessedScanRef.current === null) {
          lastProcessedScanRef.current = "initialized";
        }
      } catch (e: any) {
        console.error("Cloud Relay Polling Error:", e.message);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [branchId, handleCheckin, mounted]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      // Logic for address: ensure ws:// prefix and correct port
      const wsUrl = agentAddress.includes("://") ? agentAddress : `ws://${agentAddress}`;
      ws = new WebSocket(wsUrl);

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
  }, [resetKiosk, handleCheckin, agentAddress]);

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
              <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] backdrop-blur-md flex items-center justify-center transition-all duration-500 ${
                status === "idle" || status === "scanning" ? "bg-white/10 border border-white/20" :
                status === "success" ? "bg-emerald-500/50 border border-emerald-400/50 scale-110 shadow-[0_0_100px_rgba(16,185,129,0.8)]" :
                status === "expired" || status === "frozen" ? "bg-amber-500/50 border border-amber-400/50 scale-105 shadow-[0_0_80px_rgba(245,158,11,0.8)]" :
                "bg-rose-500/50 border border-rose-400/50 scale-105 shadow-[0_0_80px_rgba(225,29,72,0.8)]"
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

              {!agentConnected && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Scan className="w-3 h-3" />
                    Global Capture Mode Active
                  </div>
                  <p className="text-[10px] text-white/20 font-medium lowercase italic">
                    receiving real-time events via cloud relay
                  </p>
                </div>
              )}
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/80 sm:bg-black/60">
              <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold tracking-tight">Kiosk Connectivity</h2>
                    <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Hardware Agent Address</label>
                        <input 
                          type="text" 
                          value={agentAddress}
                          onChange={(e) => setAgentAddress(e.target.value)}
                          placeholder="e.g. 192.168.1.100:4010"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-display"
                        />
                        <p className="text-[10px] text-white/20 italic">Provide the IP and port of the PC running the Gymcentrix Agent.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      localStorage.setItem("gx_agent_address", agentAddress);
                      setShowSettings(false);
                      // WebSocket will auto-reconnect due to dependency array
                    }}
                    className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Apply & Synchronize
                  </button>
              </div>
            </div>
          )}

          {/* Unified Header - Silos Branding and Status to prevent collisions */}
          <div className="fixed top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-50 flex items-start justify-between pointer-events-none">
            {/* Brand Watermark - Visible only on Desktop (Lg) */}
            <div className="hidden lg:flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity pointer-events-auto">
              <Image 
                src="/app/gymcentrix-logo.png" 
                alt="Logo" 
                width={24} 
                height={24} 
                className="brightness-0 invert" 
              />
              <span className="font-display font-bold text-white tracking-tighter text-lg uppercase">GYMCENTRIX</span>
            </div>

            {/* Gym Name & Agent Status - Centered on mobile, Right-aligned on Desktop */}
            <div 
              suppressHydrationWarning
              className="flex-1 lg:flex-none flex flex-col items-center lg:items-end gap-1 md:gap-2 opacity-60 md:opacity-20 hover:opacity-100 transition-opacity pointer-events-auto">
              <span className="font-display font-bold text-white tracking-widest text-[10px] md:text-sm uppercase text-center leading-tight">
                {gymName}
              </span>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${agentConnected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse'}`} />
                <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  {agentConnected ? "Agent Connected" : "Agent Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Panel for Testing */}
          <div className="hidden sm:flex fixed bottom-8 left-8 flex-col gap-2 opacity-20 hover:opacity-100 transition-opacity">
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
        </>
      )}
    </div>
  );
}
