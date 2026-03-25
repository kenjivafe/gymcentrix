import prisma from "@/lib/prisma";
import { Search, Building2, User2, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GymsClient } from "@/components/super-admin/gyms-client";

export default async function GymsManagementPage() {
  const gyms = await prisma.gym.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <GymsClient>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        {gyms.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No gyms found</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">Register a new gym tenant to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Gym Facility</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Owner</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Registration Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden xl:table-cell">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.map((gym: any) => (
                <tr key={gym.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Building2 className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-white">{gym.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <User2 className="w-3 h-3 text-white/60" />
                      </div>
                      <span className="text-xs font-medium text-white/80">{gym.owner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-white/20" />
                       <span className="text-xs text-white/60">{new Date(gym.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-white/20 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </GymsClient>
  );
}
