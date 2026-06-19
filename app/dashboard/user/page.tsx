"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Clock, CreditCard, LogOut, CheckCircle,
  Loader2, X, History, LayoutDashboard, User as UserIcon,
  ChevronRight, Calendar, ShieldCheck, Lock, ChevronLeft
} from "lucide-react";
import Image from "next/image";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Payment Animation State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "banking" | "processing" | "success">("details");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Charging Timer State
  const [isCharging, setIsCharging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [chargingComplete, setChargingComplete] = useState(false);

  // Booking/OTP State
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let userData = localStorage.getItem("user");

    // Check if the ID is a valid 24-character hex string (ObjectId compatible)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    const generateDefaultUser = () => {
      const hexChars = "0123456789abcdef";
      let uniqueId = "";
      for (let i = 0; i < 24; i++) {
        uniqueId += hexChars[Math.floor(Math.random() * 16)];
      }
      return {
        id: uniqueId,
        name: "Guest User",
        email: "guest@parikrama.edu",
        role: "user"
      };
    };

    if (!userData) {
      const defaultUser = generateDefaultUser();
      localStorage.setItem("user", JSON.stringify(defaultUser));
      setUser(defaultUser);
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.id || !isValidObjectId(parsedUser.id)) {
          // Upgrade invalid ID to a valid ObjectId-compatible one
          const defaultUser = generateDefaultUser();
          localStorage.setItem("user", JSON.stringify(defaultUser));
          setUser(defaultUser);
        } else {
          setUser(parsedUser);
        }
      } catch (err) {
        const defaultUser = generateDefaultUser();
        localStorage.setItem("user", JSON.stringify(defaultUser));
        setUser(defaultUser);
      }
    }
  }, [router]);

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (isCharging && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCharging) {
      setIsCharging(false);
      setChargingComplete(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCharging, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const slots = [
    { type: "15min", price: 30, units: 15, time: "15 minutes" },
    { type: "30min", price: 60, units: 30, time: "30 minutes" },
    { type: "45min", price: 90, units: 45, time: "45 minutes" },
    { type: "60min", price: 120, units: 60, time: "60 minutes" },
  ];

  const handleBooking = async (slot: any) => {
    setSelectedSlot(slot);
    setPaymentAmount(slot.price);
    setShowPayment(true);
    setPaymentStep("details");
  };

  const processPayment = async () => {
    setPaymentStep("processing");
    try {
      // Simulate Razorpay Network Delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setPaymentStep("success");

      // Wait for success animation
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowPayment(false);

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotType: selectedSlot.type,
          price: selectedSlot.price,
          email: user.email,
          userId: user.id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveBooking(data.booking);
      setShowVerify(true);
    } catch (err: any) {
      alert(err.message);
      setShowPayment(false);
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
          otp: activeBooking.otp,
          bookingId: activeBooking._id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVerificationResult("success");

      setTimeout(() => {
        setShowVerify(false);
        // Start Charging Timer
        const minutes = parseInt(activeBooking.slotType.replace("min", ""));
        setTimeLeft(minutes * 60);
        setIsCharging(true);
        setChargingComplete(false);

        setActiveBooking(null);
        setOtpInput("");
        setVerificationResult(null);
      }, 500);
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
        <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-xs bg-slate-50 hover:bg-slate-100 py-2 px-3 rounded-xl border border-slate-100 transition-all active:scale-95 shadow-sm">
          <ChevronLeft className="w-4 h-4" /> Back / मागे जा
        </Link>
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
          <div
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20"
          >
            <LayoutDashboard className="w-5 h-5" />
            Booking Slots
          </div>
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
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-sm border border-slate-200/60 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Home / मागे जा
            </Link>
          </div>
        </div>
      </aside>



      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-10 bg-slate-50 overflow-y-auto min-h-screen pb-10 lg:pb-10">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Infrastructure</h2>
          <p className="text-slate-500 font-medium mt-2">Parikrama Faculty of Engineering - Smart Charging Grid</p>
        </div>

        {/* Charging Timer Section */}
        <AnimatePresence>
          {(isCharging || chargingComplete) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-10 p-8 rounded-[3rem] border-4 flex flex-col md:flex-row items-center justify-between gap-8 ${chargingComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900 border-primary/20 shadow-2xl shadow-primary/20'
                }`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-3xl ${chargingComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/20 text-primary animate-pulse'}`}>
                  <Zap className="w-8 h-8 font-bold" />
                </div>
                <div>
                  <h3 className={`text-2xl font-black ${chargingComplete ? 'text-emerald-900' : 'text-white'}`}>
                    {chargingComplete ? "Charging Successful!" : "Charging in Progress..."}
                  </h3>
                  <p className={chargingComplete ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                    {chargingComplete ? "Vehicle is fully charged and ready." : "Your EV is being powered by Parikrama Green Grid."}
                  </p>
                </div>
              </div>

              {!chargingComplete ? (
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Time Remaining</span>
                  <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                </div>
              ) : (
                <button
                  onClick={() => setChargingComplete(false)}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                >
                  Acknowledge
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Booking Confirmed</h3>
                    <button onClick={() => setShowVerify(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-emerald-50 text-emerald-600 p-6 rounded-full mb-6 border border-emerald-100 relative">
                      <span className="relative flex h-3 w-3 absolute top-0 right-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <Zap className="w-12 h-12 text-emerald-600 fill-emerald-100" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 leading-none">Ready to Charge!</h4>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-wider">तुमची बुकिंग यशस्वी झाली आहे</p>
                  </div>

                  {/* Slot summary info */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected Slot / वेळ</span>
                      <span className="text-lg font-black text-slate-800">{activeBooking?.slotType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price / किंमत</span>
                      <span className="text-xl font-black text-primary">₹{activeBooking?.price}</span>
                    </div>
                  </div>

                  {/* Rural-Friendly / Simplified OTP Display Box (Read-only, no inputs) */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 rounded-[2rem] p-6 mb-6 text-center relative overflow-hidden shadow-sm">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-200/20 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-1.5 mb-1 text-emerald-700 font-bold text-[10px] tracking-wider uppercase">
                        <span>Your OTP / तुमचा ओटीपी</span>
                      </div>
                      <div className="text-4xl font-black text-emerald-800 tracking-[0.2em] font-mono my-1 drop-shadow-sm">
                        {activeBooking?.otp}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-3 leading-relaxed">
                        Put this OTP into your hardware to start charging.
                        <br />
                        <span className="text-slate-400 font-medium">(चार्जिंग सुरू करण्यासाठी हा OTP तुमच्या मशीन/हार्डवेअरमध्ये टाका.)</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setShowVerify(false);
                        setActiveBooking(null);
                      }}
                      className="bg-primary hover:bg-primary-dark text-white font-black w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.97]"
                    >
                      OK
                    </button>
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

      {/* Razorpay Simulated Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Top Blue Bar (Razorpay style) */}
              <div className="bg-[#02042b] p-6 text-white flex flex-col items-center relative">
                {paymentStep === "details" && (
                  <button onClick={() => setShowPayment(false)} className="absolute left-4 top-6 text-white/50 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">Parikrama EV Grid</h3>
                <p className="text-white/70 text-sm">₹{paymentAmount}.00</p>
              </div>

              {/* Status Section */}
              <div className="flex flex-col bg-white min-h-[300px]">
                {paymentStep === "details" ? (
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-6">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Payment Methods</p>
                      <div className="space-y-3">
                        <button onClick={() => setPaymentStep("banking")} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 group">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform"><CreditCard className="w-5 h-5 text-primary" /></div>
                            <span className="font-bold text-slate-700">Cards, UPI & Netbanking</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </button>
                        <div className="p-4 bg-slate-50 opacity-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span className="font-bold text-slate-400">Wallet / Pay Later</span>
                          <Lock className="w-3 h-3 text-slate-300" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto p-4 bg-blue-50 rounded-xl flex gap-3 items-start">
                      <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                        Your payment is protected by Razorpay. By continuing, you agree to our terms.
                      </p>
                    </div>
                  </div>
                ) : paymentStep === "banking" ? (
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4 cursor-pointer" onClick={() => setPaymentStep("details")} /> Select Bank
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {["HDFC", "SBI", "ICICI", "AXIS"].map(bank => (
                        <button key={bank} onClick={processPayment} className="p-4 border-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all text-center">
                          <div className="w-8 h-8 bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-[10px] text-slate-400">{bank[0]}</div>
                          <span className="text-xs font-bold text-slate-600">{bank} Bank</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={processPayment} className="mt-auto w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                      Pay ₹{paymentAmount}
                    </button>
                  </div>
                ) : paymentStep === "processing" ? (
                  <div className="p-8 flex flex-col items-center justify-center flex-1">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-slate-100 border-t-[#3388ff] rounded-full mb-6"
                    />
                    <h4 className="text-lg font-bold text-slate-800">Processing Payment</h4>
                    <p className="text-slate-500 text-sm mt-2 text-center underline px-10">Please authorized the transaction on your bank's page</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 flex flex-col items-center justify-center flex-1"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <CheckCircle className="text-green-500 w-10 h-10" />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">Payment Successful</h4>
                    <p className="text-slate-500 text-sm mt-2">Redirecting to charger...</p>
                  </motion.div>
                )}
              </div>

              {/* Bottom Footer styled like Razorpay */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Secured by</span>
                  <span className="text-slate-800 font-black text-xs tracking-tight italic">Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <CreditCard className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
