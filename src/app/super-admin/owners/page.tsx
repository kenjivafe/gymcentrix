import prisma from "@/lib/prisma";
import { UserPlus, Shield, Mail, Building, MoreVertical } from "lucide-react";

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
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-widest text-accent font-bold">Access Control</p>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Gym Owners
          </h2>
          <p className="text-lg text-white/60">
            Manage administrative access for gym owners and their linked tenants.
          </p>
        </div>
        <button className="whitespace-nowrap flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl transition-all border border-white/10 active:scale-95">
          <UserPlus className="size-5" />
          Invite New Owner
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-card backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                  Owner
                </th>
                <th className="px-8 py-6 text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                  Security Status
                </th>
                <th className="px-8 py-6 text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                  Assigned Entity
                </th>
                <th className="px-8 py-6 text-xs font-bold text-white/40 uppercase tracking-[0.2em] text-right">
                  Control
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {owners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-white/30">
                    <div className="flex flex-col items-center gap-4">
                        <Shield className="size-10 opacity-20" />
                        <p className="text-lg">No gym owners found in the central registry.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-white/5 text-white rounded-2xl flex items-center justify-center font-bold group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          {owner.name?.[0] || owner.email?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors">
                            {owner.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                            <Mail className="size-3" />
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-widest">
                        <Shield className="size-3" />
                        {owner.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-white/70">
                        <Building className="size-4 text-white/30" />
                        <span className="text-sm font-semibold">
                          {owner.gymsOwned?.[0]?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/30 hover:text-white">
                        <MoreVertical className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
