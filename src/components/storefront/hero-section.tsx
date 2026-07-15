'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Phone } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">Mansehra, KPK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Your One-Stop
            <br />
            <span className="text-white/90">Cash & Carry Store</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-lg leading-relaxed">
            Wholesale & retail groceries, beverages, household items and more. Best prices in Mansehra with guaranteed quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
              }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="tel:03001234567">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
          {[
            { label: 'Products', value: '500+' },
            { label: 'Happy Customers', value: '2,000+' },
            { label: 'Years Serving', value: '5+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold">{stat.value}</p>
              <p className="text-xs md:text-sm text-white/70 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}