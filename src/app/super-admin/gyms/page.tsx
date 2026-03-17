import prisma from "@/lib/prisma";
import { Plus, Search, Building2, User2, Calendar } from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gyms Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your tenant gyms and monitor their registration status.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus className="size-5" />
          Add New Gym
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
            <Building2 className="size-12 text-slate-300 mb-4" />
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No gyms found</p>
            <p className="text-slate-500 dark:text-slate-400">Get started by creating your first gym tenant.</p>
          </div>
        ) : (
          gyms.map((gym) => (
            <div
              key={gym.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="size-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="size-7 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {gym.name}
              </h3>
              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <User2 className="size-4" />
                  <span>Owner: <span className="text-slate-900 dark:text-slate-200 font-medium">{gym.owner.name}</span></span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <Calendar className="size-4" />
                  <span>Registered: {new Date(gym.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors">
                  Details
                </button>
                <button className="flex-1 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-semibold rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
