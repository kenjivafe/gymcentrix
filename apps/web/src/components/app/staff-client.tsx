"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, User2, Mail, Trash2, ShieldCheck, MoreVertical } from "lucide-react";
import { deleteStaff } from "@/lib/actions/user";
import { AddStaffModal } from "./add-staff-modal";

interface StaffClientProps {
  staff: any[];
}

export function StaffClient({ staff }: StaffClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member? This will revoke their access immediately.")) return;
    
    setDeletingId(id);
    const result = await deleteStaff(id);
    if (result.error) {
      alert(result.error);
    }
    setDeletingId(null);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Staff Management</h2>
           <p className="text-sm text-white/40 font-medium">Manage your facility team and their administrative access roles.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* View Toggle */}
           <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden shrink-0">
              <button 
                onClick={() => setView('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === 'table' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Table
              </button>
              <button 
                onClick={() => setView('cards')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === 'cards' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
           </div>

           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-black hover:shadow-glow transition-all active:scale-95"
           >
             <Plus className="w-4 h-4" />
             Add Staff Member
           </button>
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.02] rounded-3xl">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <User2 className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-xl font-bold text-white">No staff found</p>
          <p className="text-white/40 mt-2 text-sm max-w-sm font-medium">Add your first employee to help manage gym operations.</p>
        </div>
      ) : view === 'table' ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Identity Endpoint</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight hidden xl:table-cell">Joined</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-tight">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staff.map((member: any) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <User2 className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-white/60">
                      <Mail className="w-4 h-4 text-white/20" />
                      <span className="text-xs font-medium">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                       Employee
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      className="text-white/10 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-400/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member: any) => (
            <div key={member.id} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-500">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-glow-sm">
                        <User2 className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
                     </div>
                     <button 
                       onClick={() => handleDelete(member.id)}
                       disabled={deletingId === member.id}
                       className="p-2 text-white/10 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </div>

                  <div>
                     <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors tracking-tight">{member.name}</h3>
                     <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black mt-1">Operational Staff</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                           <Mail className="w-4 h-4 text-white/20" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Email Address</p>
                           <p className="text-xs font-bold text-white/80 truncate">{member.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                           <ShieldCheck className="w-4 h-4 text-white/20" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Access Role</p>
                           <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Employee</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {isModalOpen && <AddStaffModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
