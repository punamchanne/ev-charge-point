"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Shield, Clock, MapPin, Mail, Phone, ChevronRight, GraduationCap, Globe, Cpu } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Smart Campus Charging",
      desc: "High-speed EV charging integrated with the 110-Acre green campus infrastructure.",
      icon: <Zap className="w-8 h-8 text-primary" />,
    },
    {
      title: "Sustainable Mission",
      desc: "Aligning with Parikrama's vision of cost-effective technology for socio-economic upliftment.",
      icon: <Globe className="w-8 h-8 text-secondary" />,
    },
    {
      title: "Digital Integration",
      desc: "Manage your charging sessions via your student/faculty academic credentials.",
      icon: <Cpu className="w-8 h-8 text-accent" />,
    },
  ];

  const pricing = [
    { time: "15 min", price: "30", units: "15 Units" },
    { time: "30 min", price: "60", units: "30 Units" },
    { time: "45 min", price: "90", units: "45 Units" },
    { time: "60 min", price: "120", units: "60 Units" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden relative">
      {/* Top Banner (College Affiliation) */}
      <div className="bg-primary text-white text-[9px] md:text-[10px] py-2 px-4 text-center font-bold tracking-widest uppercase leading-snug break-words w-full">
        Approved by AICTE | Affiliated to Savitribai Phule Pune University | NAAC Accredited 'A'
      </div>

      {/* Header */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 glass sticky top-0 z-50 w-full">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 transition-transform hover:scale-105 shrink-0">
            <Image
              src="/logo-v3.png"
              alt="HSBPVT'S Parikrama Logo"
              width={120}
              height={120}
              priority
              style={{ width: '100%', height: 'auto' }}
              className="max-w-[80px] md:max-w-[120px] object-contain drop-shadow-md hover:scale-110 transition-transform rounded-full"
            />
          </Link>
          <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="hidden lg:block w-full overflow-hidden">
            <h1 className="font-extrabold text-[12px] leading-tight text-primary uppercase truncate">GOI - Faculty of Engineering</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">Ahmednagar, Maharashtra</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="nav-link">Campus</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#contact" className="nav-link">Support</a>
        </div>
        <div className="flex gap-1.5 md:gap-4 items-center flex-wrap justify-end">
          <Link href="/login" className="text-primary font-bold hover:text-accent transition-colors py-1.5 px-2.5 md:py-2 md:px-4 text-[10px] md:text-base border-2 border-primary/10 rounded-xl leading-none">ERP Login</Link>
          <Link href="/register" className="bg-secondary hover:bg-amber-500 text-slate-900 font-bold py-1.5 px-2.5 md:py-2 md:px-6 text-[10px] md:text-base rounded-xl transition-all shadow-lg shadow-secondary/20 active:scale-95 leading-none">Book Slot</Link>
        </div>
      </nav>

      {/* Hero Section - Real Campus Background */}
      <section className="relative min-h-[90vh] py-20 flex items-center px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Parikrama Campus Bird View"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.4]"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>
        </div>

        <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white w-full overflow-hidden px-1"
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-slate-900 px-3 py-2 rounded-full text-[9px] md:text-xs font-black mb-6 border border-white/20 break-words max-w-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
              ECO-FRIENDLY CAMPUS INITIATIVE
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl hyphens-auto break-words">
              Powering the <br />
              <span className="text-secondary">Future of Mobility</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-100 mt-6 max-w-lg drop-shadow-md break-words">
              Official EV Charging Portal of Parikrama College of Engineering.
              Smart infrastructure for a sustainable 110-Acre academic ecosystem.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register" className="bg-secondary hover:bg-amber-500 text-slate-900 font-bold px-5 py-3 sm:px-10 sm:py-5 text-sm sm:text-xl rounded-2xl flex items-center gap-2 shadow-2xl shadow-secondary/30 transition-all active:scale-95 leading-none">
                Start Booking <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link href="#pricing" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold px-5 py-3 sm:px-10 sm:py-5 text-sm sm:text-xl rounded-2xl transition-all leading-none">
                View Pricing
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:flex justify-end"
          >
            <div className="card glass p-8 max-w-sm text-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <Zap className="text-primary w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-xl">Active Stations</p>
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Main Gate & Parking B</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white/20">
                  <span className="text-sm font-bold text-slate-600">Availability</span>
                  <span className="text-emerald-500 font-black">98% ONLINE</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white/20">
                  <span className="text-sm font-bold text-slate-600">Charging Speed</span>
                  <span className="text-primary font-black">22kW AC</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* College Mission Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-100 overflow-hidden w-full">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-secondary rounded-full"></div>
              <h2 className="text-sm font-black text-accent uppercase tracking-[0.2em]">Institutional Ethics</h2>
            </div>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">Grounded in Vision, Driven by Innovation</h3>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border-l-[6px] border-primary shadow-xl shadow-slate-200/50">
              <p className="text-xs font-bold text-primary uppercase mb-4 tracking-widest">Global Vision</p>
              <p className="text-lg text-slate-600 leading-relaxed italic font-medium">
                "To provide opportunities for students to become able professionals for the socio-economic upliftment of rural India."
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border-l-[6px] border-secondary shadow-xl shadow-slate-200/50">
              <p className="text-xs font-bold text-secondary uppercase mb-4 tracking-widest">Educational Mission</p>
              <p className="text-lg text-slate-600 leading-relaxed italic font-medium">
                "To develop simple, appropriate, and cost-effective technology helpful in the upliftment of rural society."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-8 bg-white w-full overflow-hidden">
        <div className="container mx-auto max-w-full">
          <div className="flex flex-col items-center text-center mb-10 md:mb-20 px-2">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight break-words">Advanced Campus Infrastructure</h2>
            <div className="w-24 h-2 bg-secondary mt-6 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="card border-0 bg-slate-50/50 hover:bg-white group hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center py-12 px-8"
              >
                <div className="bg-white w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:bg-primary/5 shadow-lg shadow-slate-200/50 transition-colors border border-slate-100">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-32 bg-primary px-4 md:px-8 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-950/20 skew-x-12 translate-x-32 hidden md:block"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] hidden md:block"></div>

        <div className="container mx-auto relative z-10 max-w-full">
          <div className="text-center mb-10 md:mb-20 px-2">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight break-words">Flexible Charging Plans</h2>
            <p className="text-primary-foreground/40 mt-4 text-base md:text-xl max-w-2xl mx-auto break-words">Transparent hourly rates for two-wheelers and four-wheelers on campus.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {pricing.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[3rem] text-center relative overflow-hidden group hover:bg-white/15 transition-all shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4 bg-secondary/20 p-2 rounded-full opacity-30 group-hover:opacity-100 transition-opacity">
                  <Clock className="text-secondary w-4 h-4" />
                </div>
                <h3 className="text-5xl font-black text-secondary">₹{p.price}</h3>
                <p className="text-white/40 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">{p.time} Session</p>
                <div className="my-10 border-t border-white/10 pt-10">
                  <p className="text-white font-black text-2xl">{p.units}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-bold">1 Unit = ₹2</p>
                </div>
                <Link href="/login" className="bg-white text-primary font-black py-5 rounded-[2rem] w-full block hover:bg-secondary hover:text-slate-900 transition-all shadow-xl shadow-black/20">Book Now</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Campus Photos Section */}
      <section className="py-16 md:py-24 bg-white px-2 md:px-8 w-full overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center max-w-full">
          <div className="relative h-[250px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl w-full">
            <Image src="/hero.jpg" alt="Parikrama Campus" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="space-y-6 md:space-y-8 px-2">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none text-primary uppercase break-words w-full">Innovation at Scale</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Our campus isn't just a place to study; it's a living laboratory for sustainable development.
              The EV charging project is led by the Electrical Engineering department to promote green energy within the college community.
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="bg-slate-50 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center">
                <p className="text-xl md:text-3xl font-black text-primary">110</p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Acres</p>
              </div>
              <div className="bg-slate-50 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center">
                <p className="text-xl md:text-3xl font-black text-secondary">A</p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">NAAC Grade</p>
              </div>
              <div className="bg-slate-50 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center">
                <p className="text-xl md:text-3xl font-black text-accent">SPPU</p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase break-words w-full">Affiliation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24 bg-slate-50 px-4 md:px-8 w-full overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 max-w-full">
          <div className="w-full overflow-hidden">
            <div className="bg-primary/10 inline-block px-4 py-2 rounded-xl text-primary font-black text-[10px] mb-4 tracking-widest">REACH US</div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight break-words">Find Our Station</h2>
            <p className="text-xl text-slate-500 mt-6 mb-12 leading-relaxed">
              HSBPVT’s Group of Institutions, Parikrama Engineering College.<br />
              Located at Kashti, Ahmednagar. Providing world-class infrastructure for rural empowerment.
            </p>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="bg-white p-5 rounded-[2rem] shadow-lg shadow-slate-200/50 group-hover:bg-primary transition-all group-hover:translate-x-2">
                  <Mail className="text-primary group-hover:text-white w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">Official Email</p>
                  <p className="text-lg md:text-xl font-black text-slate-800 break-all w-full pr-2">support@parikrama.edu</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 group">
                <div className="bg-white p-4 md:p-5 rounded-[1.5rem] shadow-lg shadow-slate-200/50 group-hover:bg-secondary transition-all shrink-0">
                  <Phone className="text-secondary group-hover:text-slate-900 w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="w-full overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">Institute Hotline</p>
                  <p className="text-lg md:text-xl font-black text-slate-800 tracking-tight break-words">+91 9988776655</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-3xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>
            <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Online Inquiry</h3>
            <form className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-medium placeholder:text-white/20" />
              <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-medium placeholder:text-white/20" />
              <textarea placeholder="Your Message" rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-secondary transition-all font-medium placeholder:text-white/20"></textarea>
              <button className="bg-secondary text-slate-900 w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-secondary/30 hover:scale-[1.02] transition-all active:scale-95">Send Query</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-100 text-center">
        <div className="flex justify-center mb-10 px-4 w-full overflow-hidden">
          <Image src="/logo-v3.png" alt="Logo" width={180} height={50} style={{ width: '100%', height: 'auto' }} className="max-w-[100px] md:max-w-[180px] object-contain grayscale hover:grayscale-0 transition-all cursor-pointer" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-10 text-slate-400 text-xs md:text-sm font-bold mb-8 px-4 w-full">
          <a href="#" className="hover:text-primary transition-colors">College Website</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">© 2026 Faculty of Engineering. Managed by Electrical Dept.</p>
      </footer>
    </div>
  );
}
