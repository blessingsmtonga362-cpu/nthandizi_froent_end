import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  LogOut
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isSuperAdmin = true;

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Applications", icon: FileCheck, href: "/admin/applications" },
    { label: "Student Directory", icon: Users, href: "/admin/students" },
    { label: "System Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-64 bg-[#020617] text-slate-300 flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-unima-gold rounded flex items-center justify-center text-unima-blue font-bold text-xs">AD</div>
          <span className="font-bold text-white tracking-tight">Admin Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Main Menu</div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors text-sm font-medium"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}

          {isSuperAdmin && (
            <>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mt-8 mb-2">Super Admin</div>
              <Link href="/admin/management" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium">
                <ShieldCheck size={18} /> Manage Admins
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium">
                <Settings size={18} /> System Settings
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl transition-colors text-sm font-bold">
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="text-sm text-slate-500">Academic Year: <span className="font-bold text-unima-blue">2023/2024</span></div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-unima-blue border border-slate-200">
              AD
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-unima-blue">Admin Controller</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
