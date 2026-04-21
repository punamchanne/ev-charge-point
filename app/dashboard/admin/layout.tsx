"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Zap, Users, FileText, BarChart as BarIcon, 
  LogOut, Menu, X 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData || JSON.parse(userData).role !== "admin") {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: <BarIcon className="w-5 h-5" /> },
    { label: "User Mgmt", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-[60] shadow-xl">
        <div className="flex items-center gap-3">
          <Zap className="text-emerald-500 w-6 h-6" />
          <span className="font-black tracking-tight text-sm uppercase">Admin Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-xl transition-all active:scale-90">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:h-screen
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="hidden lg:flex p-10 items-center gap-4">
          <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight uppercase">Admin</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-3 mt-6 lg:mt-0">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsSidebarOpen(false)} 
              className={`
                p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 font-bold
                ${pathname === item.href ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 mb-24 lg:mb-0">
          <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/5">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logged in as</p>
             <p className="text-sm font-bold text-slate-300 truncate">{user?.name || 'Administrator'}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 font-bold group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Main Content Scroll Area */}
      <main className="flex-1 p-4 lg:p-10 w-full overflow-x-hidden md:max-h-screen md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
