import prisma from "@/lib/prisma";
import { Search, Building2, User2, Calendar } from "lucide-react";
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
    <div className="space-y-10">
      <GymsClient>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gyms.length === 0 ? (
          <div className="col-span-full py-32 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
            <div className="size-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Building2 className="size-10 text-white/20" />
            </div>
            <p className="text-2xl font-bold text-white">No gyms found</p>
            <p className="text-white/50 mt-2 max-w-sm">Get started by creating your first gym tenant in the system infrastructure.</p>
          </div>
        ) : (
          gyms.map((gym) => (
            <div
              key={gym.id}
              className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col hover:bg-white/10 transition-all duration-500 shadow-card"
            >
              <div className="size-16 bg-white/5 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                <Building2 className="size-8 text-white/60 group-hover:text-primary transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {gym.name}
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/50">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                    <User2 className="size-4" />
                  </div>
                  <span className="text-sm">Owner: <span className="text-white font-medium">{gym.owner.name}</span></span>
                </div>
                <div className="flex items-center gap-3 text-white/50">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Calendar className="size-4" />
                  </div>
                  <span className="text-sm">Registered: <span className="text-white/80">{new Date(gym.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-white/5 flex gap-4">
                <button className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all">
                  Details
                </button>
                <button className="flex-1 px-4 py-3 text-primary bg-primary/10 hover:bg-primary/20 text-sm font-bold rounded-xl transition-all">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </GymsClient>
    </div>
  );
}
