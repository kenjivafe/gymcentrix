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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gym Owners
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage administrative access for gym owners and their linked tenants.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-950 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95">
          <UserPlus className="size-5" />
          Invite New Owner
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Owner
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Linked Gym
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {owners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No gym owners found in the system.
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                          {owner.name?.[0] || owner.email?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {owner.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <Mail className="size-3" />
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-wider">
                        <Shield className="size-3" />
                        {owner.role}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Building className="size-4 text-slate-400" />
                        <span className="text-sm font-medium">
                          {owner.gymsOwned?.[0]?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white">
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
