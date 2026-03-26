"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Mail, Lock, ShieldCheck, ChevronRight, Globe, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const user = session?.user as any;
      if (user.role === "SUPER_ADMIN") {
        router.replace("/super-admin" as any);
      } else {
        router.replace("/app" as any);
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="relative">
           <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
           </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Account verification failed");
      }
    } catch (err) {
      setError("Infrastructure error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] overflow-hidden font-sans">
      {/* Left Column: Hero & Branding */}
      <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center overflow-hidden">
        <Image 
          src="/app/gymcentrix-hero.jpg" 
          alt="Facility Management" 
          fill 
          className="object-cover opacity-40 grayscale-[0.5] contrast-[1.1]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="relative z-10 p-12 max-w-2xl">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 animate-in slide-in-from-left duration-700">
             Next-Gen Gym Operating System
           </p>
           <h1 className="text-6xl uppercase font-display font-black tracking-tight text-white leading-[0.9] mb-8 animate-in slide-in-from-left duration-1000">
             Your Gym, <br/>
             <span className="text-shadow-glow italic text-primary uppercase"> Amplified.</span>
           </h1>
           <p className="text-lg text-white/40 leading-relaxed font-medium max-w-md animate-in slide-in-from-left duration-1000 delay-200">
             Streamline membership, automate facility access, and manage your staff with precision from one unified platform.
           </p>
        </div>

        <div className="absolute bottom-12 left-12 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
           </div>
           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Secure Member Data</span>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 md:p-12 lg:p-24 bg-white/[0.01]">
         {/* Top Navigation Overlay */}
         <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 relative">
                  <Image src="/app/gymcentrix-logo.png" alt="Logo" fill className="object-contain" />
               </div>
               <span className="text-lg font-display font-black tracking-tighter text-white uppercase">GYMCENTRIX</span>
            </div>
            <div className="flex items-center gap-4">
               <button className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Need Help?
               </button>
            </div>
         </div>

         <div className="w-full max-w-md space-y-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-display font-bold text-white tracking-tight">Welcome back</h2>
               <p className="text-sm text-white/40 font-medium">Please enter your account details to access the dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-6">
                  <div className="group space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium" 
                        />
                     </div>
                  </div>

                  <div className="group space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all font-medium font-mono" 
                        />
                     </div>
                     <div className="flex justify-end">
                        <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot Password?</button>
                     </div>
                  </div>
               </div>

               {error && (
                 <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black text-center uppercase tracking-widest animate-in shake">
                   {error}
                 </div>
               )}

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-primary hover:shadow-glow-strong active:scale-[0.98] py-5 rounded-2xl text-black font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   <>
                     Access Dashboard
                     <ChevronRight className="w-4 h-4" />
                   </>
                 )}
               </button>
            </form>
         </div>

         {/* Footer Links Overlay */}
         <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]">
               &copy; 2026 Northernware
            </p>
            <div className="flex items-center gap-8">
               <button className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Language: English
               </button>
               <button className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Support</button>
               <button className="text-[9px] font-black text-primary uppercase tracking-widest">v2.4.12</button>
            </div>
         </div>
      </div>
    </div>
  );
}
