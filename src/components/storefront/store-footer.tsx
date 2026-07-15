'use client';

import { Truck, Clock, Shield, Headphones } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 5,000' },
  { icon: Clock, title: 'Open 7 Days', desc: '8 AM - 10 PM daily' },
  { icon: Shield, title: 'Quality Products', desc: '100% genuine items' },
  { icon: Headphones, title: 'Customer Support', desc: 'Call or WhatsApp us' },
];

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.08]">
      {/* Features bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-[#0057D9]/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-[#3A8DFF]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{f.title}</p>
                <p className="text-xs text-white/40">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-white/[0.08] bg-[#03050A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-extrabold text-lg text-white">
                ONESTOP <span className="text-[var(--gold)]">CASH & CARRY</span>
              </h3>
              <p className="text-sm text-white/40 mt-3 leading-relaxed">
                Your trusted wholesale & retail store in Mansehra. Quality products at the best prices since day one.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Contact Us</h4>
              <p className="text-sm text-white/40">Mansehra, KPK, Pakistan</p>
              <p className="text-sm text-white/40 mt-1">Phone: 0300-1234567</p>
              <p className="text-sm text-white/40 mt-1">WhatsApp: 0300-1234567</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Store Hours</h4>
              <p className="text-sm text-white/40">Monday - Sunday</p>
              <p className="text-sm text-white/40 mt-1">8:00 AM - 10:00 PM</p>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} Onestop Cash & Carry, Mansehra. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}