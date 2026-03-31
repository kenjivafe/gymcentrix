"use client";

import { useState } from "react";
import { 
  MoreVertical, 
  Settings, 
  Trash2, 
  ExternalLink, 
  X, 
  AlertTriangle,
  CheckCircle2,
  Copy,
  Terminal
} from "lucide-react";
import { deleteAgent, updateAgent } from "@/app/actions/agent";

interface Agent {
  id: string;
  name: string;
  branchId: string;
  apiKey: string;
  status: string;
}

import { createPortal } from "react-dom";

export function AgentActions({ agent }: { agent: Agent }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [modal, setModal] = useState<"edit" | "delete" | "config" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState(agent.name);
  const [copied, setCopied] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right - window.scrollX
    });
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAgent(agent.id);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setModal(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateAgent(agent.id, newName);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setModal(null);
    }
  };

  const copyConfig = () => {
    const config = {
      agentId: agent.id,
      branchId: agent.branchId,
      apiUrl: typeof window !== "undefined" ? window.location.origin.replace("3000", "3001") : "https://gymcentrix-api.vercel.app",
      apiKey: agent.apiKey,
      wsPort: 4010,
      retryIntervalMs: 30000,
      rfidTimeoutMs: 500,
      rfidLength: 10
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menu = showMenu && typeof document !== "undefined" && createPortal(
    <>
      <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
      <div 
        className="fixed z-[70] w-48 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        style={{ 
          top: `${menuPosition.top + 8}px`, 
          right: `${menuPosition.right}px` 
        }}
      >
        <button 
          onClick={() => { setModal("config"); setShowMenu(false); }}
          className="w-full px-4 py-3 text-left text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
        >
          <Terminal className="w-4 h-4" />
          View Configuration
        </button>
        <button 
          onClick={() => { setModal("edit"); setShowMenu(false); }}
          className="w-full px-4 py-3 text-left text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
        >
          <Settings className="w-4 h-4" />
          Edit Properties
        </button>
        <div className="h-px bg-white/5" />
        <button 
          onClick={() => { setModal("delete"); setShowMenu(false); }}
          className="w-full px-4 py-3 text-left text-xs font-bold text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/5 flex items-center gap-3 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </>,
    document.body
  );

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {menu}

      {/* Modals */}
      {modal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          
          <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {modal === "edit" ? "Edit Hardware Node" : modal === "delete" ? "Delete Node" : "Node Configuration"}
              </h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {modal === "edit" && (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Node Name</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </form>
              )}

              {modal === "delete" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                    <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
                    <h4 className="text-rose-400 font-bold mb-1">Delete Access Point?</h4>
                    <p className="text-rose-400/60 text-xs">This node will immediately stop working and will need to be re-provisioned.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="flex-1 py-3 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all">Cancel</button>
                    <button 
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
                    >
                      {loading ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}

              {modal === "config" && (
                <div className="space-y-6">
                  <div className="relative group">
                    <pre className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 p-4 rounded-xl overflow-x-auto max-h-64">
                      {JSON.stringify({
                        agentId: agent.id,
                        branchId: agent.branchId,
                        apiUrl: typeof window !== "undefined" ? window.location.origin.replace("3000", "3001") : "https://gymcentrix-api.vercel.app",
                        apiKey: agent.apiKey,
                        wsPort: 4010,
                        retryIntervalMs: 30000,
                        rfidTimeoutMs: 500,
                        rfidLength: 10
                      }, null, 2)}
                    </pre>
                    <button 
                      onClick={copyConfig}
                      className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-all shadow-xl"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-white/40 italic">Replace your local `agent-config.json` with this block.</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
