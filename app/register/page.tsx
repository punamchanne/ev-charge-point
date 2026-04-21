"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User as UserIcon, Loader2, ChevronLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server returned non-JSON response (likely a 404 or redirect)");
      }

      if (!res.ok) throw new Error(data?.error || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side: Campus Visual */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image 
          src="/auth-bg.jpg" 
          alt="Parikrama Campus" 
          fill 
          sizes="50vw"
          className="object-cover scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-20 text-white">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
           >
              <div className="bg-secondary/20 p-4 rounded-3xl w-fit mb-8 border border-secondary/30">
                 <Zap className="text-secondary w-10 h-10" />
              </div>
              <h2 className="text-5xl font-black mb-6 leading-tight">Join the Sustainable <br /> Revolution.</h2>
              <div className="w-20 h-2 bg-primary rounded-full mb-8"></div>
              <p className="text-xl font-medium text-slate-300 max-w-sm">
                Create your student/faculty account to access smart EV charging stations across the 110-acre Parikrama campus.
              </p>
           </motion.div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16">
        <div className="mb-12">
           <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 w-fit rounded-xl transition-all font-bold text-slate-600 text-sm">
              <ChevronLeft className="w-4 h-4" /> Home
           </Link>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
               <p className="text-slate-500 font-bold mt-2">HSBPVT's GOI Portal Registration</p>
            </div>

            <div className="bg-white">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-8 border border-red-100 italic">
                  * {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3 ml-2">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input 
                      type="text" 
                      required
                      placeholder="Enter Full Name"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3 ml-2">Academic Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      placeholder="name@parikrama.edu"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3 ml-2">Secure Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input 
                      type="password" 
                      required
                      placeholder="Min. 8 characters"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-slate-700"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2">
                    <button 
                    disabled={loading}
                    className="bg-slate-900 hover:bg-black text-white font-black w-full py-6 rounded-[2rem] text-xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <>Join Portal <ArrowRight className="w-6 h-6" /></>}
                    </button>
                </div>
              </form>

              <p className="text-center text-slate-500 font-bold mt-10">
                Already registered? <Link href="/login" className="text-primary hover:underline underline-offset-4">Log in here</Link>
              </p>
            </div>
        </div>

        <div className="mt-auto flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <Image 
              src="/logo-v3.png" 
              alt="Logo" 
              width={100} 
              height={100} 
              style={{ height: 'auto' }}
              className="grayscale opacity-50" 
            />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Parikrama GOI Portal</p>
        </div>
      </div>
    </div>
  );
}
