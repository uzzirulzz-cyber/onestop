'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Phone, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-[92vh] flex justify-center items-center text-center relative overflow-hidden hero-gradient enterprise-grid">
      {/* Animated glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[700px] h-[700px] bg-[#0057D9]/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] bg-[#F5B400]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-[#003B91]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto animate-fade-up">
          {/* Enterprise badge */}
          <div className="enterprise-badge mb-8 inline-flex">
            <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Mansehra, KPK</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/50">Premium Wholesale & Retail</span>
          </div>

          {/* Main heading */}
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] tracking-[-0.03em]">
            <span className="gradient-text block">ONESTOP</span>
            <span className="text-white/90 block mt-1">CASH & CARRY</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/45 max-w-xl mx-auto leading-relaxed font-light">
            Premium wholesale &amp; retail groceries, beverages, household items and more.
            <span className="text-white/60 font-medium"> Best prices in Mansehra</span> with guaranteed quality.
          </p>

          {/* Premium Search Box */}
          <div className="mt-10 flex max-w-[680px] mx-auto bg-[rgba(17,24,39,0.8)] rounded-[60px] overflow-hidden border border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-shadow duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.12)]">
            <div className="flex-1 flex items-center px-6">
              <Sparkles className="w-4 h-4 text-white/20 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search 500+ products..."
                className="w-full bg-transparent border-none text-white py-4 outline-none placeholder:text-white/25 text-[15px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const event = new CustomEvent('navigate', { detail: { page: 'products', search: e.currentTarget.value.trim() } });
                    window.dispatchEvent(event);
                  }
                }}
              />
            </div>
            <button
              className="bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black px-8 font-bold text-[14px] hover:from-[#FFD44D] hover:to-[#F5B400] transition-all duration-300 shadow-[0_4px_15px_rgba(245,180,0,0.25)]"
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                if (input && input.value.trim()) {
                  const event = new CustomEvent('navigate', { detail: { page: 'products', search: input.value.trim() } });
                  window.dispatchEvent(event);
                }
              }}
            >
              Search
            </button>
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="btn-gold rounded-[50px] px-8 h-12 text-[14px] font-bold tracking-wide"
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
                className="rounded-[50px] px-8 h-14 border-white/[0.12] text-white/70 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.2] text-[14px] font-medium transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { label: 'Products', value: '500+' },
              { label: 'Customers', value: '2,000+' },
              { label: 'Years', value: '5+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-black gradient-text-gold">{stat.value}</p>
                <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05070D] to-transparent pointer-events-none" />
    </section>
  );
}