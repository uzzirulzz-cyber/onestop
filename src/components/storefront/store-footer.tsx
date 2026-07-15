'use client';

import { Truck, Clock, Shield, Headphones, Crown } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 5,000' },
  { icon: Clock, title: 'Open 7 Days', desc: '8 AM - 10 PM daily' },
  { icon: Shield, title: 'Quality Products', desc: '100% genuine items' },
  { icon: Headphones, title: 'Customer Support', desc: 'Call or WhatsApp us' },
];

export function StoreFooter() {
  return (
    <footer className="mt-auto">
      {/* Features bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#0057D9]/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-[18px] h-[18px] text-[#3A8DFF]" />
              </div>
              <div>
                <p className="font-semibold text-[13px] text-white/90">{f.title}</p>
                <p className="text-[11px] text-white/30">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Main footer */}
      <div className="bg-[#03050A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0057D9] to-[#003B91] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-[#F5B400]" />
                </div>
                <div>
                  <p className="font-extrabold text-[14px] text-white leading-none">ONESTOP</p>
                  <p className="text-[9px] font-bold text-[#F5B400] tracking-[0.12em] uppercase leading-none mt-0.5">Cash & Carry</p>
                </div>
              </div>
              <p className="text-[13px] text-white/30 leading-relaxed max-w-xs">
                Your trusted wholesale &amp; retail store in Mansehra. Quality products at the best prices since day one.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-[13px] text-white/80 uppercase tracking-wider mb-4">Contact Us</h4>
              <div className="space-y-2.5">
                <p className="text-[13px] text-white/35">Mansehra, KPK, Pakistan</p>
                <p className="text-[13px] text-white/35">Phone: <span className="text-white/50">0300-1234567</span></p>
                <p className="text-[13px] text-white/35">WhatsApp: <span className="text-white/50">0300-1234567</span></p>
              </div>
            </div>

            {/* Store Hours */}
            <div>
              <h4 className="font-semibold text-[13px] text-white/80 uppercase tracking-wider mb-4">Store Hours</h4>
              <div className="space-y-2.5">
                <p className="text-[13px] text-white/35">Monday - Sunday</p>
                <p className="text-[13px] text-white/50 font-medium">8:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-[11px] text-white/20">
              &copy; {new Date().getFullYear()} Onestop Cash &amp; Carry, Mansehra. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}