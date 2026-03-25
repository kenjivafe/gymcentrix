import prisma from "@/lib/prisma";
import { GitBranch, Building2, MapPin, Calendar, ChevronRight } from "lucide-react";
import { BranchesClient } from "@/components/super-admin/branches-client";

export default async function BranchesManagementPage() {
  const [branches, gyms] = await Promise.all([
    prisma.branch.findMany({
      include: {
        gym: true,
        _count: {
          select: {
            members: true,
            agents: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.gym.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <BranchesClient gyms={gyms}>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
        {branches.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <GitBranch className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xl font-bold text-white">No branches found</p>
            <p className="text-white/40 mt-2 text-sm max-w-sm">Add a branch location to a gym to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Branch</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Gym</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden md:table-cell">Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden lg:table-cell">Members</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden lg:table-cell">Agents</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight hidden xl:table-cell">Created</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-white/40 uppercase tracking-widest leading-tight">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {branches.map((branch: any) => (
                <tr key={branch.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <GitBranch className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-white">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Building2 className="w-3 h-3 text-white/60" />
                      </div>
                      <span className="text-xs font-medium text-white/80">{branch.gym.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-white/20 shrink-0" />
                       <span className="text-xs text-white/60 truncate max-w-[200px]">{branch.address || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs font-bold text-white/70">{branch._count.members}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs font-bold text-white/70">{branch._count.agents}</span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-white/20" />
                       <span className="text-xs text-white/60">{new Date(branch.createdAt).toLocaleDateString()}</span>
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
    </BranchesClient>
  );
}
