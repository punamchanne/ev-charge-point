"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16">
        <div className="mb-12">
           <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 w-fit rounded-xl transition-all font-bold text-slate-600 text-sm">
              <ChevronLeft className="w-4 h-4" /> Back to Home
           </Link>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
            <div className="mb-12 flex flex-col items-center lg:items-start gap-6">
               <div className="p-2 transition-all hover:scale-105">
                  <Image 
                    src="/logo-v3.png" 
                    alt="Logo" 
                    width={150} 
                    height={150} 
                    priority
                    style={{ height: 'auto' }}
                    className="object-contain" 
                  />
               </div>
               <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portal Login</h1>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Parikrama EV Infrastructure</p>
               </div>
            </div>

            <div className="bg-white">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-8 border border-red-100 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Institutional Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      placeholder="name@parikrama.edu"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Portal Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white font-black w-full py-6 rounded-[1.5rem] text-xl mt-4 flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <>Sign In <ArrowRight className="w-6 h-6" /></>}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                <p className="text-slate-500 font-bold">
                  New member? <Link href="/register" className="text-primary hover:underline underline-offset-4">Create account</Link>
                </p>
                <div className="bg-secondary/10 p-4 rounded-2xl w-full border border-secondary/20">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest text-center">
                        Admin Access: admin@parikrama.edu / admin123
                    </p>
                </div>
              </div>
            </div>
        </div>

        <div className="mt-auto text-center">
           <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">© 2026 Parikrama GOI - Faculty of Engineering</p>
        </div>
      </div>

      {/* Right Side: High-Impact Campus Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image 
          src="/auth-bg.jpg" 
          alt="Parikrama Engineering Building" 
          fill 
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-20 text-white">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
           >
              <h2 className="text-5xl font-black mb-6 leading-tight">Empowering Rural <br /> Excellence.</h2>
              <div className="w-20 h-2 bg-secondary rounded-full mb-8"></div>
              <p className="text-xl font-medium text-slate-100 max-w-md">
                Managing our green energy infrastructure with digital efficiency. 
                Designed and maintained by the Electrical Engineering Department.
              </p>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
