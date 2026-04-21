"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Clock, CreditCard, LogOut, CheckCircle, 
  Loader2, X, History, LayoutDashboard, User as UserIcon,
  ChevronRight, Calendar
} from "lucide-react";
import Image from "next/image";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' or 'history'
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Booking/OTP State
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/login");
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchHistory(parsedUser.id);
      } catch (err) {
        router.replace("/login");
      }
    }
  }, [router]);

  const fetchHistory = async (userId: string) => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/user/bookings?userId=${userId}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const slots = [
    { type: "15min", price: 30, units: 15, time: "15 minutes" },
    { type: "30min", price: 60, units: 30, time: "30 minutes" },
    { type: "45min", price: 90, units: 45, time: "45 minutes" },
    { type: "60min", price: 120, units: 60, time: "60 minutes" },
  ];

  const handleBooking = async (slot: any) => {
    setLoading(slot.type);
    try {
      // Simulate Payment
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotType: slot.type,
          price: slot.price,
          email: user.email,
          userId: user.id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveBooking(data.booking);
      setShowVerify(true);
      fetchHistory(user.id); // Refresh history
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otpInput,
          bookingId: activeBooking._id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVerificationResult("success");
      fetchHistory(user.id); // Refresh history status
      
      setTimeout(() => {
        setShowVerify(false);
        setActiveBooking(null);
        setOtpInput("");
        setVerificationResult(null);
      }, 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
      <div className="bg-primary/10 p-4 rounded-full animate-bounce">
        <Zap className="text-primary w-8 h-8" />
      </div>
      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">Authenticating Portal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white sticky top-0 z-50 shadow-sm">
         <Image src="/logo-v3.png" alt="Logo" width={60} height={60} className="object-contain" />
         <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 rounded-lg active:scale-95 transition-all">
            <LogOut className="w-5 h-5" />
         </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 border-r border-slate-100 flex-col p-8 sticky h-screen top-0 bg-white">
         <div className="mb-12 flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <Image src="/logo-v3.png" alt="Logo" width={120} height={120} className="object-contain hover:scale-110 transition-transform" />
            <div className="text-center">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Parikrama GOI</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase">EV Infrastructure</p>
            </div>
         </div>

        <nav className="space-y-4 flex-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Booking Slots
          </button>
          
          <button 
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'history' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <History className="w-5 h-5" />
            Booking History
          </button>
        </nav>

        <div className="pt-8 border-t border-slate-100 mt-auto">
           <div className="bg-slate-50 p-6 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                 <div className="bg-white p-3 rounded-full text-primary shadow-sm border border-slate-100 flex-shrink-0">
                    <UserIcon className="w-5 h-5" />
                 </div>
                 <div className="truncate">
                    <p className="font-black text-slate-800 text-sm leading-none capitalize truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Institutional Member</p>
                 </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-red-500 font-bold rounded-xl text-sm border border-red-50 hover:bg-red-50 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
           </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 flex justify-around items-center z-50">
          <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-slate-300'}`}>
             <LayoutDashboard className="w-6 h-6" />
             <span className="text-[9px] font-black uppercase tracking-widest">Slots</span>
          </button>
          <button onClick={() => setActiveTab("history")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-primary scale-110' : 'text-slate-300'}`}>
             <History className="w-6 h-6" />
             <span className="text-[9px] font-black uppercase tracking-widest">History</span>
          </button>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-10 bg-slate-50 overflow-y-auto min-h-screen pb-24 lg:pb-10">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div 
              key="dash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Infrastructure</h2>
                <p className="text-slate-500 font-medium mt-2">Parikrama Faculty of Engineering - Smart Charging Grid</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {slots.map((slot, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[3rem]"></div>
                    <div className="bg-slate-50 p-5 rounded-3xl mb-8 border border-slate-100">
                      <Zap className="text-primary w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 leading-none">{slot.time}</h3>
                    <p className="bg-secondary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full mt-4 border border-secondary/20">
                      {slot.units} UNITS
                    </p>
                    
                    <div className="mt-10 mb-8 border-t border-slate-50 pt-8 w-full text-center">
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest block mb-1">Price Plan</span>
                      <span className="text-4xl font-black text-slate-900">₹{slot.price}</span>
                    </div>

                    <button 
                      onClick={() => handleBooking(slot)}
                      disabled={loading !== null}
                      className="bg-primary hover:bg-primary-dark text-white font-black w-full py-5 rounded-[2rem] text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading === slot.type ? <Loader2 className="animate-spin w-5 h-5" /> : <>Book Now <CreditCard className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Booking History</h2>
                <p className="text-slate-500 font-medium mt-2">View your past charging sessions and generated OTPs.</p>
              </div>

              <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                {loadingBookings ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-primary w-10 h-10" />
                      <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Loading Records...</p>
                   </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-20">
                     <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History className="text-slate-300 w-10 h-10" />
                     </div>
                     <p className="text-xl font-bold text-slate-800">No bookings yet</p>
                     <p className="text-slate-400 mt-2">Start your first charging session from the dashboard.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest">
                          <th className="pb-6 px-4">Slot Details</th>
                          <th className="pb-6 px-4">Session Date</th>
                          <th className="pb-6 px-4">Pricing</th>
                          <th className="pb-6 px-4">Assigned OTP</th>
                          <th className="pb-6 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {bookings.map((b) => (
                          <tr key={b._id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-6 px-4">
                               <div className="flex items-center gap-3">
                                  <div className="bg-primary/5 p-3 rounded-xl">
                                     <Zap className="text-primary w-5 h-5" />
                                  </div>
                                  <span className="font-black text-slate-800">{b.slotType}</span>
                               </div>
                            </td>
                            <td className="py-6 px-4">
                               <div className="flex items-center gap-2 text-slate-600 font-bold">
                                  <Calendar className="w-4 h-4 text-slate-300" />
                                  {new Date(b.createdAt).toLocaleDateString()}
                                  <span className="text-slate-300 ml-1 font-medium">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                               </div>
                            </td>
                            <td className="py-6 px-4 text-lg font-black text-slate-900">₹{b.price}</td>
                            <td className="py-6 px-4">
                               <span className="font-mono bg-slate-900 text-secondary px-3 py-1.5 rounded-lg text-sm font-bold tracking-widest">
                                 {b.otp}
                               </span>
                            </td>
                            <td className="py-6 px-4 text-center">
                               <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                 b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                               }`}>
                                 {b.status}
                               </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Verification Modal (Remains the same but styled better) */}
      <AnimatePresence>
        {showVerify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
              onClick={() => !verifying && setShowVerify(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
              
              {!verificationResult ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Access Control</h3>
                    <button onClick={() => setShowVerify(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    A secure OTP has been dispatched to <b>{user.email}</b>. Enter it to activate the charger at <b>Parking Zone B</b>.
                  </p>
                  <div className="space-y-8">
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="0 0 0 0 0 0"
                      className="w-full text-center text-5xl font-black border-0 bg-slate-50 rounded-3xl py-8 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-200 tracking-[0.2em]"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button 
                      onClick={handleVerify}
                      disabled={verifying || otpInput.length < 6}
                      className="bg-primary hover:bg-primary-dark text-white font-black w-full py-6 rounded-[2rem] text-xl shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {verifying ? <Loader2 className="animate-spin mx-auto w-8 h-8" /> : "Verify & Activate Charger"}
                    </button>
                    <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest italic font-medium">Please check your official parikrama email inbox</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl"
                  >
                    <CheckCircle className="text-emerald-600 w-12 h-12" />
                  </motion.div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Charger Active</h3>
                  <p className="text-slate-500 font-bold mt-4">Charging cycle started for {activeBooking?.slotType}.</p>
                  <div className="mt-10 p-4 bg-emerald-50 rounded-2xl text-emerald-700 font-bold text-sm">
                     ⚡ Current Flow: 22.5 kWh Ready
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
