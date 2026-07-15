'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Phone } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex justify-center items-center text-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003B91]/60 via-transparent to-[#05070D]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0057D9]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F5B400]/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0057D9]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10">
            <MapPin className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-sm font-medium text-white/80">Mansehra, KPK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            <span className="gradient-text">ONESTOP</span>
            <br />
            <span className="text-white">CASH & CARRY</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Premium wholesale & retail groceries, beverages, household items and more. Best prices in Mansehra with guaranteed quality.
          </p>

          {/* Search Box */}
          <div className="mt-10 flex max-w-[750px] mx-auto bg-[#111827] rounded-[60px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/[0.08]">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const event = new CustomEvent('navigate', { detail: { page: 'products', search: e.currentTarget.value.trim() } });
                  window.dispatchEvent(event);
                }
              }}
            />
            <button
              className="bg-[var(--gold)] text-black px-8 font-bold hover:bg-[var(--gold-light)] transition-colors"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Search products..."]') as HTMLInputElement;
                if (input && input.value.trim()) {
                  const event = new CustomEvent('navigate', { detail: { page: 'products', search: input.value.trim() } });
                  window.dispatchEvent(event);
                }
              }}
            >
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-[var(--gold)] text-black font-bold rounded-full px-8 hover:bg-[var(--gold-light)] hover:shadow-[0_15px_35px_rgba(245,180,0,0.3)] transition-all"
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
              }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="tel:03001234567">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { label: 'Products', value: '500+' },
              { label: 'Happy Customers', value: '2,000+' },
              { label: 'Years Serving', value: '5+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}