"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, Building2, User2, Mail, ShieldCheck } from "lucide-react";
import { registerGym } from "@/lib/actions/gym";

const formSchema = z.object({
  name: z.string().min(2, "Gym name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Valid email is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddGymModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await registerGym(data);
      if (result.error) {
        if (typeof result.error === "string") {
          setError(result.error);
        } else {
          setError("Validation failed. Check your inputs.");
        }
      } else {
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-canvas-subtle border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 right-0 p-6 z-10">
          <button 
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="p-10 lg:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="size-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Register Gym</h2>
            <p className="text-white/50">Configure a new tenant and assign an owner.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="size-3" />
                Gym Name
              </label>
              <input
                {...register("name")}
                placeholder="Metabolic Fitness Center"
                className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl text-white outline-none transition-all"
              />
              {errors.name && (
                <p className="text-xs text-rose-400 font-medium ml-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <User2 className="size-3" />
                  Owner Name
                </label>
                <input
                  {...register("ownerName")}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl text-white outline-none transition-all"
                />
                {errors.ownerName && (
                  <p className="text-xs text-rose-400 font-medium ml-1">{errors.ownerName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="size-3" />
                  Owner Email
                </label>
                <input
                  {...register("ownerEmail")}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl text-white outline-none transition-all"
                />
                {errors.ownerEmail && (
                  <p className="text-xs text-rose-400 font-medium ml-1">{errors.ownerEmail.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="size-5" />
                  Authorize & Register
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
