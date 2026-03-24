import prisma from "@/lib/prisma";
import { UserPlus, Shield, Mail, Building2, ChevronRight } from "lucide-react";

export default async function OwnersManagementPage() {
  const owners = await prisma.user.findMany({
    where: {
      role: "GYM_OWNER",
    },
    include: {
      gymsOwned: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Gym Owners</h2>
           <p className="text-sm text-white/40">Manage administrative access for organization owners.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-black hover:shadow-glow transition-all active:scale-95">
          <UserPlus className="w-4 h-4" />
          Invite New Owner
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        {owners.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No owners found</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">Invite a new gym owner to the system.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Admin Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden md:table-cell">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Assigned Facility</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {owners.map((owner: any) => (
                <tr key={owner.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 text-white rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {owner.name?.[0] || owner.email?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {owner.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {owner.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      <Shield className="w-3 h-3" />
                      OWNER
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Building2 className="w-4 h-4 text-white/40 group-hover:text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/80">
                        {owner.gymsOwned?.[0]?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-white/20 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
