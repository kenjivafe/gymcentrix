import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  if (user.role !== "SUPER_ADMIN") {
    redirect("/"); // Or an unauthorized page
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="border-b bg-white dark:bg-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            G
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            Gymcentrix <span className="text-indigo-600">Admin</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {session.user?.name}
            </p>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              {user.role}
            </p>
          </div>
          <div className="size-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            {session.user?.name?.[0]}
          </div>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
