"use client";

import { useState } from "react";
import { Copy, Plus, X, Server, CheckCircle2 } from "lucide-react";
import { createAgent } from "@/app/actions/agent";

interface Branch {
  id: string;
  name: string;
}

export function CreateAgentModal({ branches }: { branches: Branch[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState(branches[0]?.id || "");
  
  // Result State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !branchId) return;

    setLoading(true);
    setError(null);
    const result = await createAgent(branchId, name);
    
    if (result.error) {
       setError(result.error);
    } else if (result.apiKey && result.agent) {
       setApiKey(result.apiKey);
       setAgentId(result.agent.id);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(JSON.stringify({
         agentId,
         branchId,
         apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://gymcentrix-api.vercel.app",
         apiKey,
         wsPort: 4010,
         retryIntervalMs: 30000,
         rfidTimeoutMs: 500,
         rfidLength: 10
      }, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeAndReset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setApiKey(null);
      setAgentId(null);
      setName("");
      setError(null);
    }, 300);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50 rounded-xl font-bold flex items-center gap-2 transition-all"
      >
        <Plus className="w-4 h-4" />
        Provision Hardware
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={apiKey ? undefined : closeAndReset} // don't allow click-away if key is showing
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-black/50 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Server className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-white leading-none mb-1">
                  {apiKey ? "Hardware Provisioned" : "Provision Access Point"}
                </h3>
                <p className="text-xs text-white/40">
                  {apiKey ? "Save these credentials securely" : "Deploy a new RFID agent"}
                </p>
             </div>
          </div>
          {!apiKey && (
            <button onClick={closeAndReset} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {apiKey ? (
            <div className="space-y-6">
               <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                  <h4 className="text-emerald-500 font-bold mb-1">Agent Config Generated</h4>
                  <p className="text-emerald-500/60 text-xs">This key will only be shown once. Copy the config below and replace your local `agent-config.json`.</p>
               </div>

               <div className="relative group">
                  <pre className="text-xs font-mono text-white/60 bg-white/5 border border-white/10 p-4 rounded-xl overflow-x-auto">
                    {JSON.stringify({
                       agentId,
                       branchId,
                       apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://gymcentrix-api.vercel.app",
                       apiKey,
                       wsPort: 4010,
                       retryIntervalMs: 30000,
                       rfidTimeoutMs: 500,
                       rfidLength: 10
                    }, null, 2)}
                  </pre>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-all shadow-xl"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
               </div>

               <button 
                  onClick={closeAndReset}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all"
               >
                 I have saved the config
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Device Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Front Door Reader"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Target Branch</label>
                <select 
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                >
                  {branches.length === 0 && <option value="">No branches found...</option>}
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading || branches.length === 0}
                  className="w-full py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Generating Keys..." : "Provision Hardware"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
