"use client";

import { Download } from "lucide-react";

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
  const handleDownload = () => {
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

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-config-${agent.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="w-full px-4 py-3 text-left text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
    >
      <Download className="w-4 h-4 text-primary" />
      Download agent-config.json
    </button>
  );
}
