"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Search, Loader2, ChevronLeft, Zap, Clock, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    (b?.email?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (b?.slotType?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (b?.otp && b.otp.includes(search))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <Link href="/dashboard/admin" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-sm mb-4">
                 <ChevronLeft className="w-4 h-4" /> Dashboard
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                 <History className="text-primary w-10 h-10" /> Booking History
              </h1>
           </div>

           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search email, slot, or OTP..."
                className="pl-14 pr-8 py-4 bg-white border-none rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-600 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
           {loading ? (
             <div className="p-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-slate-400 font-bold">Loading history...</p>
             </div>
           ) : filteredBookings.length === 0 ? (
             <div className="p-20 text-center">
                <p className="text-slate-400 font-bold">No bookings recorded.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">User</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Slot Details</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Pricing</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">OTP & Date</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredBookings.map((booking, i) => (
                        <motion.tr 
                          key={booking._id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <UserIcon className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-700 text-sm">{booking.email}</p>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">User ID: ...{booking.userId?.slice(-6)}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="bg-primary/10 p-2 rounded-lg">
                                    <Zap className="text-primary w-4 h-4" />
                                 </div>
                                 <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{booking.slotType}</p>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-xl font-black text-slate-900">₹{booking.price}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div>
                                 <p className="font-black text-primary flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {booking.otp}
                                 </p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                    {new Date(booking.createdAt).toLocaleString()}
                                 </p>
                              </div>
                           </td>
                        </motion.tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
