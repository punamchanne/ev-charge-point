"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, FileText, IndianRupee, PieChart as PieIcon, 
  BarChart as BarIcon, Zap, RefreshCw 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok) {
        setStats({ _error: data.error });
      } else {
        setStats(data);
      }
    } catch (err: any) {
      console.error(err);
      setStats({ _error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return null; // Layout handles loading or we can add a spinner here

  if (stats && stats._error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100">
        <h3>Dashboard Error:</h3>
        <p>{stats._error}</p>
        <button onClick={fetchStats} className="mt-4 px-4 py-2 bg-red-100 rounded-xl hover:bg-red-200 transition-colors">Try Again</button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time usage and revenue analytics.</p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl border border-slate-200 transition-all shadow-sm active:scale-95 group">
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Users", val: stats.totalUsers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Bookings", val: stats.totalBookings, icon: <FileText />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Revenue", val: `₹${stats.revenue}`, icon: <IndianRupee />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Slots", val: stats.completedBookings, icon: <Zap />, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6"
          >
            <div className={`${s.bg} ${s.color} p-5 rounded-2xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{s.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <BarIcon className="text-primary w-5 h-5" /> Booking by Slot Type
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bookingBySlot}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <PieIcon className="text-secondary w-5 h-5" /> OTP Pool Usage
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Used', value: stats.otpStats.find((o:any) => o._id === true)?.count || 0 },
                    { name: 'Unused', value: stats.otpStats.find((o:any) => o._id === false)?.count || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#ef4444" stroke="none" />
                  <Cell fill="#10b981" stroke="none" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" /> <span className="text-[10px] font-black uppercase text-slate-400">Used</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" /> <span className="text-[10px] font-black uppercase text-slate-400">Unused</span></div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <FileText className="text-primary w-5 h-5" /> Recent Bookings
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1 rounded-full border border-slate-100">Across System</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slot</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">OTP</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentBookings?.map((bg: any) => (
                <tr key={bg._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 text-sm">{bg.userId?.name || 'Deleted User'}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{bg.userId?.email || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-700 text-xs uppercase">{bg.slotType}</td>
                  <td className="px-8 py-5 font-black text-slate-900 text-sm">₹{bg.price}</td>
                  <td className="px-8 py-5 font-black text-primary text-sm font-mono tracking-wider">{bg.otp}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      bg.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {bg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
