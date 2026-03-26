"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, UserCheck, Search, Filter, MoreVertical, CreditCard, Calendar, Clock, Trash2 } from "lucide-react";
import { deleteMember } from "@/lib/actions/member";
import { AddMemberModal } from "./add-member-modal";

interface MemberClientProps {
  members: any[];
  branches: any[];
  gymId: string;
}

export function MemberClient({ members, branches, gymId }: MemberClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                         (m.rfidUid && m.rfidUid.toLowerCase().includes(search.toLowerCase()));
    const matchesBranch = branchFilter === "all" || m.branchId === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member? All attendance logs will be lost.")) return;
    setDeletingId(id);
    const result = await deleteMember(id);
    if (result.error) alert(result.error);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Member Directory</h2>
           <p className="text-sm text-white/40 font-medium">Manage facility access profiles and track membership status.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           {/* View Toggle */}
           <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden shrink-0">
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${view === 'table' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}><List className="w-3.5 h-3.5" /></button>
              <button onClick={() => setView('cards')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${view === 'cards' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
           </div>

           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95">
             <Plus className="w-4 h-4" />
             Register Member
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Search by name or RFID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <Filter className="w-4 h-4 text-white/20" />
           <select 
             value={branchFilter}
             onChange={(e) => setBranchFilter(e.target.value)}
             className="bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-[10px] font-black uppercase text-white tracking-widest focus:outline-none focus:border-primary/50"
           >
             <option value="all">All Branches</option>
             {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
           </select>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.02] rounded-3xl">
          <UserCheck className="w-12 h-12 text-white/5 mb-4" />
          <p className="text-lg font-bold text-white">No members found</p>
          <p className="text-white/40 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : view === 'table' ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Branch Assignment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">RFID Token</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-white/40 uppercase tracking-widest">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {filteredMembers.map(m => (
                 <tr key={m.id} className="hover:bg-primary/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                             <UserCheck className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-white">{m.name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-medium text-white/60">{m.branch.name}</span>
                    </td>
                    <td className="px-6 py-4">
                       {m.rfidUid ? (
                         <code className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{m.rfidUid}</code>
                       ) : (
                         <span className="text-[10px] text-white/20 font-black uppercase italic tracking-widest">Unassigned</span>
                       )}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.membershipStatus === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border border-rose-400/20'}`}>
                          {m.membershipStatus}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id} className="p-2 text-white/10 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {filteredMembers.map(m => (
             <div key={m.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 shadow-glow-sm">
                      <UserCheck className="w-6 h-6" />
                   </div>
                   <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id} className="p-2 text-white/10 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                   <div>
                      <h4 className="text-lg font-display font-bold text-white tracking-tight">{m.name}</h4>
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mt-0.5">{m.branch.name}</p>
                   </div>
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">RFID Status</p>
                         <div className="flex items-center gap-1.5">
                            <CreditCard className={`w-3 h-3 ${m.rfidUid ? 'text-primary' : 'text-white/20'}`} />
                            <span className={`text-[10px] font-bold ${m.rfidUid ? 'text-white' : 'text-white/20 uppercase italic'}`}>{m.rfidUid || 'None'}</span>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.membershipStatus === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                         {m.membershipStatus}
                      </span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {isModalOpen && <AddMemberModal branches={branches} gymId={gymId} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
