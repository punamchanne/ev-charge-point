"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Calendar, Search, Loader2, ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
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
                 <Users className="text-primary w-10 h-10" /> User Management
              </h1>
           </div>

           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search name or email..."
                className="pl-14 pr-8 py-4 bg-white border-none rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-600 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Students</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{users.length}</p>
           </div>
           <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <p className="text-primary font-bold text-[10px] uppercase tracking-widest">Active Today</p>
              <p className="text-3xl font-black text-primary mt-2">--</p>
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
           {loading ? (
             <div className="p-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
                <p className="text-slate-400 font-bold">Loading users...</p>
             </div>
           ) : filteredUsers.length === 0 ? (
             <div className="p-20 text-center">
                <p className="text-slate-400 font-bold">No users found.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joined On</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredUsers.map((user, i) => (
                        <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase text-xl">
                                    {user.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-800 capitalize leading-none">{user.name}</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 inline-block">Institutional Member</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="space-y-1">
                                 <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Mail className="w-3 h-3" /> {user.email}
                                 </p>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="flex items-center gap-2 text-sm font-bold text-slate-500 italic">
                                 <Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                           </td>
                           <td className="px-8 py-6">
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-100 uppercase">
                                 Verified
                              </span>
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
