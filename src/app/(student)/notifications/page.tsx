"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Application Successfully Submitted",
      message: "Your student support profiling application has been received.",
      time: "2 hours ago",
      isRead: false,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20 pt-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-brand-slate tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium mt-1">Stay updated on your profiling progress and campus news.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue">
            <Check className="mr-2 w-4 h-4" /> Mark all as read
          </Button>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-50">
            <Trash2 className="mr-2 w-4 h-4" /> Clear all
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative bg-white rounded-[2rem] border p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50",
                !n.isRead ? "border-brand-blue/10 shadow-sm" : "border-slate-100 opacity-80"
              )}
            >
              {/* Unread Indicator Dot */}
              {!n.isRead && (
                <div className="absolute top-8 left-3 w-2 h-2 bg-brand-blue rounded-full" />
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Box */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500",
                  n.bg, n.color
                )}>
                  <n.icon size={28} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="font-black text-brand-slate text-lg leading-tight group-hover:text-brand-blue transition-colors">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      {n.time}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
                    {n.message}
                  </p>

                  {/* Actions (Only for Action Required type) */}
                  {n.type === "urgent" && (
                    <div className="mt-6 flex gap-3">
                      <Button className="bg-brand-blue hover:bg-brand-blueDark text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Fix Now
                      </Button>
                      <Button variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          /* Empty State */
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-black text-brand-slate tracking-tight">All caught up</h3>
            <p className="text-slate-400 text-sm font-medium mt-2">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}