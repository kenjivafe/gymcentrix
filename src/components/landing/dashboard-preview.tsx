'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  BarChart3, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  UserPlus,
  Clock,
  DollarSign
} from 'lucide-react';

// --- Mock Data ---

const MOCK_MEMBERS = [
  { id: 1, name: 'Maria Santos', plan: 'Premium VIP', status: 'Active', lastCheckIn: '2 mins ago', joinDate: 'Jan 12, 2024' },
  { id: 2, name: 'John Reyes', plan: 'Basic Monthly', status: 'Active', lastCheckIn: '1 hour ago', joinDate: 'Feb 05, 2024' },
  { id: 3, name: 'Mark Dela Cruz', plan: 'Premium VIP', status: 'Inactive', lastCheckIn: '3 days ago', joinDate: 'Nov 20, 2023' },
  { id: 4, name: 'Elena Garcia', plan: 'Basic Monthly', status: 'Active', lastCheckIn: '10 mins ago', joinDate: 'Mar 01, 2024' },
  { id: 5, name: 'Ricardo Ramos', plan: 'Premium VIP', status: 'Active', lastCheckIn: 'Just now', joinDate: 'Dec 15, 2023' },
];

const MOCK_ATTENDANCE = [
  { id: 1, name: 'Ricardo Ramos', time: '09:12 AM', method: 'RFID Card', status: 'Success' },
  { id: 2, name: 'Maria Santos', time: '09:10 AM', method: 'RFID Card', status: 'Success' },
  { id: 3, name: 'Elena Garcia', time: '09:05 AM', method: 'RFID Card', status: 'Success' },
  { id: 4, name: 'John Reyes', time: '08:15 AM', method: 'Manual Entry', status: 'Success' },
  { id: 5, name: 'Liza Soberano', time: '07:30 AM', method: 'RFID Card', status: 'Success' },
];

const MOCK_PAYMENTS = [
  { id: 1, name: 'Maria Santos', amount: '₱2,500', status: 'Paid', dueDate: 'Apr 12, 2024' },
  { id: 2, name: 'John Reyes', amount: '₱1,200', status: 'Pending', dueDate: 'Mar 25, 2024' },
  { id: 3, name: 'Elena Garcia', amount: '₱1,200', status: 'Paid', dueDate: 'Apr 01, 2024' },
  { id: 4, name: 'Ricardo Ramos', amount: '₱2,500', status: 'Paid', dueDate: 'Apr 15, 2024' },
];

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-sm' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'group-hover:text-white'}`} />
    <span className="font-medium text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, trendUp }: { icon: any, label: string, value: string, trend: string, trendUp: boolean }) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trendUp ? '+' : '-'}{trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-white/40 text-xs uppercase tracking-wider font-bold">{label}</p>
      <h4 className="text-2xl font-display font-bold text-white tracking-tight">{value}</h4>
    </div>
  </div>
);

// --- Page Views ---

const DashboardView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Total Members" value="1,248" trend="12%" trendUp />
      <StatCard icon={CalendarCheck} label="Check-ins Today" value="84" trend="5%" trendUp />
      <StatCard icon={UserPlus} label="New This Month" value="42" trend="8%" trendUp />
      <StatCard icon={DollarSign} label="Monthly Revenue" value="₱142,500" trend="15%" trendUp />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <h5 className="text-lg font-bold text-white">Attendance Trends</h5>
          <div className="flex gap-2">
            {['7D', '1M', '3M'].map(t => (
              <button key={t} className={`px-3 py-1 text-xs rounded-lg border border-white/5 ${t === '1M' ? 'bg-white/10 text-white' : 'text-white/40'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {[45, 60, 40, 75, 55, 90, 65, 80, 50, 70, 85, 95].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div 
                className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all duration-500 cursor-pointer" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h + 20}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 px-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
            <span key={m} className="text-[10px] text-white/20 uppercase font-bold">{m}</span>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <h5 className="text-lg font-bold text-white mb-6">Recent Activity</h5>
        <div className="space-y-6">
          {MOCK_ATTENDANCE.slice(0, 4).map((record) => (
            <div key={record.id} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 overflow-hidden p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/20 to-primary/40" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{record.name}</p>
                <p className="text-xs text-white/40">RFID Check-in • {record.time}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
          ))}
          <button className="w-full py-3 text-xs font-bold text-white/40 hover:text-white border border-white/5 rounded-xl transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MembersView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center justify-between">
      <h5 className="text-xl font-bold text-white">Member Directory</h5>
      <button className="bg-primary text-black px-4 py-2 rounded-xl text-xs font-bold hover:shadow-glow transition-all">Add New Member</button>
    </div>
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Member Name</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Membership Plat</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider hidden sm:table-cell">Last Check-in</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {MOCK_MEMBERS.map((m) => (
            <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                    {m.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{m.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-white/60">{m.plan}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  m.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                }`}>
                  {m.status}
                </span>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell">
                <span className="text-xs text-white/40 italic">{m.lastCheckIn}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-white/20 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AttendanceView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center justify-between">
      <h5 className="text-xl font-bold text-white">Daily Attendance Log</h5>
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-xl text-xs font-bold border border-white/5 text-white/60 hover:text-white transition-all">Filter</button>
        <button className="px-4 py-2 rounded-xl text-xs font-bold border border-white/5 text-white/60 hover:text-white transition-all">Export CSV</button>
      </div>
    </div>
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Member</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Time</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider hidden sm:table-cell">Method</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {MOCK_ATTENDANCE.map((a) => (
            <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-white">{a.name}</td>
              <td className="px-6 py-4 text-xs text-white/60">{a.time}</td>
              <td className="px-6 py-4 text-xs text-white/60 hidden sm:table-cell">{a.method}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PaymentsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 rounded-2xl bg-primary text-black">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Estimated Revenue</p>
        <h4 className="text-3xl font-display font-bold">₱248,300</h4>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
          <TrendingUp className="w-3 h-3" />
          +12.4% from last month
        </div>
      </div>
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Overdue Payments</p>
        <h4 className="text-3xl font-display font-bold text-rose-400">12</h4>
        <p className="mt-4 text-[10px] font-bold text-white/40">Requires immediate attention</p>
      </div>
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Upcoming Collections</p>
        <h4 className="text-3xl font-display font-bold text-white">48</h4>
        <p className="mt-4 text-[10px] font-bold text-white/40">Due in the next 7 days</p>
      </div>
    </div>

    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-x-auto">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h5 className="font-bold text-white">Recent Payments</h5>
        <Search className="w-4 h-4 text-white/20" />
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Member</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-wider">Next Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {MOCK_PAYMENTS.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-white">{p.name}</td>
              <td className="px-6 py-4 text-sm font-medium text-white">{p.amount}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  p.status === 'Paid' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-white/40">{p.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReportsView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center justify-between">
      <h5 className="text-xl font-bold text-white">Gym Analytics</h5>
      <select className="bg-transparent border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer">
        <option>Last 30 Days</option>
        <option>Last 3 Months</option>
      </select>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h6 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-widest">Active vs Inactive Members</h6>
        <div className="flex items-center justify-center py-8">
           <div className="relative w-40 h-40">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" className="stroke-white/5 stroke-[12] fill-transparent" />
               <circle cx="80" cy="80" r="70" className="stroke-primary stroke-[12] fill-transparent transition-all duration-1000" strokeDasharray="440" strokeDashoffset="88" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-2xl font-display font-bold text-white">82%</span>
               <span className="text-[10px] font-bold text-white/40 uppercase">Retention</span>
             </div>
           </div>
        </div>
        <div className="flex justify-around mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-white/60">Active (1,023)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-xs text-white/60">Inactive (225)</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h6 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-widest">Busiest Gym Hours</h6>
        <div className="space-y-4">
          {[
            { label: '06:00 - 09:00 AM', val: 90 },
            { label: '09:00 - 12:00 PM', val: 40 },
            { label: '12:00 - 03:00 PM', val: 30 },
            { label: '03:00 - 06:00 PM', val: 65 },
            { label: '06:00 - 09:00 PM', val: 95 },
          ].map(h => (
            <div key={h.label} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                <span>{h.label}</span>
                <span>{h.val}% Peak</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${h.val}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'members': return <MembersView />;
      case 'attendance': return <AttendanceView />;
      case 'payments': return <PaymentsView />;
      case 'reports': return <ReportsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <section className="px-6 py-12 sm:py-24 lg:px-14 relative overflow-hidden bg-black/40 border-y border-white/5 snap-start">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center lg:text-left mb-16 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">LIVE PREVIEW</h3>
          <h2 className="text-4xl sm:text-7xl font-display font-bold tracking-tighter leading-tight max-w-4xl">
            Explore the <span className="text-primary italic">Dashboard</span>
          </h2>
          <p className="text-base sm:text-xl text-white/50 max-w-3xl leading-relaxed font-sans">
            Manage members, track attendance, and monitor gym performance from one simple, 
            high-performance dashboard. Go ahead, click around.
          </p>
        </div>

        {/* Dashboard Shell */}
        <div className="relative group max-w-7xl mx-auto">
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden h-[650px]">
            {/* Sidebar / Top Nav */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-6 space-y-6 md:space-y-8 bg-white/[0.01]">
              <div className="flex items-center gap-3 px-2 mb-2 md:mb-0">
                <Image 
                  src="/app/gymcentrix-logo.png" 
                  alt="Gymcentrix" 
                  width={32} 
                  height={32} 
                  className="w-6 h-6 md:w-8 md:h-8 object-contain logo-glow" 
                />
                <span className="font-display font-bold text-white tracking-tighter text-base md:text-lg uppercase">GYMCENTRIX</span>
              </div>

              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 scrollbar-hide">
                <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
                  <SidebarItem 
                    icon={LayoutDashboard} 
                    label="Dashboard" 
                    active={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')} 
                  />
                  <SidebarItem 
                    icon={Users} 
                    label="Members" 
                    active={activeTab === 'members'} 
                    onClick={() => setActiveTab('members')} 
                  />
                  <SidebarItem 
                    icon={CalendarCheck} 
                    label="Attendance" 
                    active={activeTab === 'attendance'} 
                    onClick={() => setActiveTab('attendance')} 
                  />
                  <SidebarItem 
                    icon={CreditCard} 
                    label="Payments" 
                    active={activeTab === 'payments'} 
                    onClick={() => setActiveTab('payments')} 
                  />
                  <SidebarItem 
                    icon={BarChart3} 
                    label="Reports" 
                    active={activeTab === 'reports'} 
                    onClick={() => setActiveTab('reports')} 
                  />
                </div>
              </div>

              <div className="hidden md:block pt-8 mt-auto md:absolute md:bottom-8 md:w-[208px]">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Status</p>
                  <p className="text-xs text-white/60 mb-3">RFID Reader Connected</p>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-full animate-pulse" />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col bg-white/[0.01]">
              {/* Top Bar */}
              <header className="h-16 border-b border-white/5 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex-1 max-w-xs md:max-w-md">
                   <Search className="w-4 h-4 text-white/20 shrink-0" />
                   <input 
                     type="text" 
                     placeholder="Search..." 
                     className="bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:ring-0 w-full p-0" 
                     readOnly
                   />
                </div>
                <div className="flex items-center gap-4 md:gap-6 ml-4">
                   <div className="relative hidden sm:block">
                     <Bell className="w-5 h-5 text-white/40" />
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-black" />
                   </div>
                   <div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/10 p-0.5">
                     <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary/40 to-primary/80" />
                   </div>
                </div>
              </header>

              {/* View Content */}
              <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
