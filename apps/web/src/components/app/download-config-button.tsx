"use client";

import { Download, Loader2, FileArchive } from "lucide-react";
import JSZip from "jszip";
import { useState } from "react";

interface AgentConfig {
  agentId: string;
  branchId: string;
  apiUrl: string;
  apiKey: string;
  wsPort: number;
  retryIntervalMs: number;
  rfidTimeoutMs: number;
  rfidLength: number;
}

export function DownloadConfigButton({ agent }: { agent: any }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const config: AgentConfig = {
        agentId: agent.id,
        branchId: agent.branchId,
        apiUrl: typeof window !== "undefined" ? window.location.origin.replace("3000", "3001") : "https://gymcentrix-api.vercel.app",
        apiKey: agent.apiKey,
        wsPort: 4010,
        retryIntervalMs: 30000,
        rfidTimeoutMs: 500,
        rfidLength: 10
      };

      const zip = new JSZip();
      
      // 1. Add agent-config.json
      zip.file("agent-config.json", JSON.stringify(config, null, 2));

      // 2. Add README.txt
      zip.file("README.txt", `
Gymcentrix Agent — Ready to Run
===============================

1. Extract this ZIP to a folder.
2. Ensure "agent-config.json" is in the same folder as "GymcentrixAgent.exe".
3. Double-click "GymcentrixAgent.exe" to start.

The app will automatically register itself to start with Windows.
Check the system tray (near the clock) for the Gymcentrix icon to manage settings or view logs.
      `.trim());

      // 3. Fetch and add the Executable (hosted in /public/bin)
      const response = await fetch("/bin/GymcentrixAgent.exe");
      if (!response.ok) throw new Error("Failed to fetch agent binary");
      const binaryData = await response.arrayBuffer();
      zip.file("GymcentrixAgent.exe", binaryData, { binary: true });

      // 4. Generate and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gymcentrix-agent-${agent.name.toLowerCase().replace(/\s+/g, "-")}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to bundle agent package. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className={`w-full px-4 py-3 text-left text-xs font-bold flex items-center gap-3 transition-all ${
        isDownloading 
          ? "text-white/20 bg-white/5 cursor-not-allowed" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
      ) : (
        <FileArchive className="w-4 h-4 text-emerald-400" />
      )}
      {isDownloading ? "Bundling Agent App..." : "Download Agent Bundle (ZIP)"}
    </button>
  );
}
