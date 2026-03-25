import React from "react";
import Image from "next/image";
import { 
  ClipboardList, 
  AlertCircle, 
  UserSearch, 
  Clock, 
  BarChart3 
} from "lucide-react";

const problems = [
  {
    title: "Manual Attendance",
    description: "Staff still track check-ins using logbooks or paper sheets.",
    icon: ClipboardList,
    image: "/problems/manual-attendance.png"
  },
  {
    title: "Missed Payments",
    description: "Without a proper system, it's easy to lose track of memberships and payment dates.",
    icon: AlertCircle,
    image: "/problems/missed-payments.png"
  },
  {
    title: "Member Tracking",
    description: "No clear way to see who actually visits the gym and how often.",
    icon: UserSearch,
    image: "/problems/member-tracking.png"
  },
  {
    title: "Admin Work Overload",
    description: "Staff spend hours handling records instead of helping members.",
    icon: Clock,
    image: "/problems/admin-work-overload.png"
  },
  {
    title: "No Real Insights",
    description: "Gym owners struggle to understand attendance trends, active members, and business performance.",
    icon: BarChart3,
    image: "/problems/no-real-insights.png"
  },
];

function ProblemContent({ problem, isTall }: { problem: any, isTall?: boolean }) {
  return (
    <div className={`h-full flex flex-col justify-end gap-3 sm:gap-6 relative z-10 transition-all duration-500 ${isTall ? 'p-6 sm:p-12' : 'p-6 sm:p-10'}`}>
      {problem.image && (
        <div className="absolute inset-0 z-[-1]">
          <Image 
            src={problem.image} 
            alt={problem.title}
            fill
            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <problem.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-primary transition-colors" />
      </div>
      <div className="space-y-1.5 sm:space-y-3">
        <h4 className="text-base sm:text-xl font-display font-bold tracking-tight">{problem.title}</h4>
        <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-sans">{problem.description}</p>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section id="solution" className="px-6 py-12 sm:py-24 lg:px-14 relative overflow-hidden snap-start">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center lg:text-left mb-10 sm:mb-20 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">PROBLEM</h3>
          <h2 className="text-4xl font-display font-bold tracking-tighter sm:text-7xl leading-[1.1] max-w-9xl mx-auto">
            Running a Gym <br className="hidden sm:block" />
            <span className="text-white/50">Shouldn&apos;t Be This</span> <span className="text-primary italic">Messy.</span>
          </h2>
          <p className="text-base sm:text-xl text-white/50 max-w-9xl mx-auto leading-relaxed font-sans">
            Managing a growing gym with manual systems quickly becomes difficult. 
            Attendance logs, membership tracking, and payment monitoring often end up 
            scattered across notebooks, spreadsheets, and staff memory.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-2 md:gap-4 max-w-7xl mx-auto md:min-h-[850px] md:auto-rows-fr">
          {/* Row 1, Col 1 & 2 - Small Cards */}
          <div className="md:col-span-1 md:row-span-1 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative aspect-square md:aspect-auto">
            <ProblemContent problem={problems[0]} />
          </div>
          <div className="md:col-span-1 md:row-span-1 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative aspect-square md:aspect-auto">
            <ProblemContent problem={problems[1]} />
          </div>

          {/* Row 1 & 2, Col 3 - Tall Card 1 */}
          <div className="md:col-span-1 md:row-span-2 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative aspect-square md:aspect-auto">
            <ProblemContent problem={problems[2]} isTall />
          </div>

          {/* Row 2 & 3, Col 1 - Tall Card 2 */}
          <div className="md:col-span-1 md:row-span-2 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative aspect-square md:aspect-auto">
            <ProblemContent problem={problems[3]} isTall />
          </div>

          {/* Row 2, Col 2 - Small Card */}
          <div className="md:col-span-1 md:row-span-1 rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-glow transition-all duration-500 shadow-sm group overflow-hidden relative aspect-square md:aspect-auto">
            <ProblemContent problem={problems[4]} />
          </div>

          {/* Row 3, Col 2 & 3 - Solution Spanning 2 Columns */}
          <div className="md:col-span-2 md:row-span-1 relative p-12 rounded-3xl border border-primary/20 bg-black/20 backdrop-blur-xl overflow-hidden text-center shadow-glow group flex items-center justify-center">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
             <div className="space-y-6 relative z-10 w-full">
                <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tighter">
                  There&apos;s a <span className="text-primary italic">Better Way.</span>
                </h3>
                <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
                  Gymcentrix centralizes member management, automates attendance, tracks payments, and provides clear insights into member activity and gym performance.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-primary font-bold uppercase tracking-widest text-[10px] sm:text-2xs">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     RFID tap check-ins
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     Attendance dashboards
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,243,62,0.4)]" />
                     Membership & payment tracking
                   </div>
                </div>
             </div>
             {/* Abstract Decoration */}
             <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}
