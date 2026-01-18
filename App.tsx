
import React, { useState, useEffect, useRef } from 'react';
import { CameraOrder, AIService } from './types';
import BookingForm from './components/BookingForm';
import AISuite from './components/AISuite';
import ChatBot from './components/ChatBot';
import LiveAssistant from './components/LiveAssistant';
import { CURRENCY } from './constants';

const App: React.FC = () => {
  const [orders, setOrders] = useState<CameraOrder[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewOrder = (order: CameraOrder) => {
    setOrders(prev => [order, ...prev]);
    
    // WhatsApp Notification logic
    const phoneNumber = "8767160204";
    const message = `*LensMaster Order!*%0A*Customer:* ${order.customerName}%0A*Gear:* ${order.cameraName}%0A*Duration:* ${order.days} Days%0A*Total:* ${CURRENCY}${order.totalBill}%0A*Status:* Confirmed`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab (simulated notification for owner)
    window.open(waUrl, '_blank');
  };

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 3D Glass Header */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/30 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse transition-delay-1000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000">
          <div className="mb-6 inline-block py-2 px-6 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl animate-fade-in-down">
            <span className="text-cyan-400 font-bold tracking-widest text-xs">AI-POWERED CINEMATOGRAPHY</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 transition-all hover:scale-105 duration-500 select-none cursor-default">
            LENS MASTER <br/> <span className="text-cyan-500">PRO STUDIO</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Rent the world's finest cinema gear with automated billing and Gemini 3 intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={scrollToBooking}
              className="px-10 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-lg transition-all shadow-[0_0_40px_rgba(8,145,178,0.4)] hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] hover:-translate-y-1"
            >
              BOOK NOW
            </button>
            <button 
              onClick={() => document.getElementById('ai-suite')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl font-black text-lg transition-all hover:-translate-y-1"
            >
              EXPLORE AI
            </button>
          </div>
        </div>

        {/* Floating 3D Elements Placeholder */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-slate-600 text-2xl"></i>
        </div>
      </header>

      {/* Middle Interactive Animation Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#020617] to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-2 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-12">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-[500px] object-cover rounded-2xl"
                  alt="Camera Pro"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black">SONY A7R V</h3>
                  <p className="text-cyan-400 font-bold">In-Stock Now</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-950/50 border border-cyan-800">
                <i className="fas fa-microchip text-cyan-400"></i>
                <span className="text-cyan-300 font-bold text-sm">Powered by Gemini 3 Pro</span>
              </div>
              <h2 className="text-5xl font-black leading-tight">Smart Rentals <br/> reimagined.</h2>
              <p className="text-lg text-slate-400">
                Analyze your shots, edit with voice, and get real-time cinematic advice from our built-in AI assistant. We don't just rent cameras; we empower your vision.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: 'fa-bolt', label: 'Ultra Fast', sub: 'Lite 2.5 Engine' },
                  { icon: 'fa-brain', label: 'Deep Think', sub: 'Pro 3 Reasoning' },
                  { icon: 'fa-video', label: 'Veo 3', sub: 'Pro Video Gen' },
                  { icon: 'fa-map-pin', label: 'Maps', sub: 'Location Search' }
                ].map((feature, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors">
                    <i className={`fas ${feature.icon} text-cyan-500 mb-2`}></i>
                    <p className="font-bold text-white">{feature.label}</p>
                    <p className="text-xs text-slate-500">{feature.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Hub Section */}
      <section id="ai-suite" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black mb-4">THE AI CREATIVE HUB</h2>
            <p className="text-slate-500">Edit, Generate, and Analyze gear like never before.</p>
          </div>
          <AISuite />
        </div>
      </section>

      {/* Booking Section (Now at bottom as requested) */}
      <section id="booking-section" className="py-24 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black mb-6">RESERVE NOW</h2>
            <div className="w-24 h-1 bg-cyan-600 mx-auto"></div>
          </div>
          <BookingForm onOrder={handleNewOrder} />
        </div>
      </section>

      <ChatBot />
      <LiveAssistant />

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 font-medium">
        <p>© 2024 LENS MASTER PRO STUDIO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default App;
