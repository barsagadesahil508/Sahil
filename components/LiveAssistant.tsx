
import React, { useState } from 'react';

const LiveAssistant: React.FC = () => {
  const [isLive, setIsLive] = useState(false);

  // Simplified UI for Live API integration
  // The actual implementation would follow the provided Session Setup logic
  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      // In a real app, logic for navigator.mediaDevices.getUserMedia and ai.live.connect starts here
      console.log("Gemini Live Session Started");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button 
        onClick={toggleLive}
        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 relative ${
          isLive ? 'bg-red-600 animate-pulse scale-110' : 'bg-gradient-to-tr from-cyan-600 to-blue-600 hover:scale-105'
        }`}
      >
        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20"></div>
        <i className={`fas ${isLive ? 'fa-microphone-slash' : 'fa-microphone-lines'} text-2xl text-white mb-1`}></i>
        <span className="text-[10px] font-black tracking-tighter uppercase">{isLive ? 'Live' : 'Voice'}</span>
      </button>
      
      {isLive && (
        <div className="absolute bottom-24 right-0 bg-slate-900 border border-red-500/30 p-4 rounded-2xl w-64 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-red-400">GEMINI LIVE ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">I'm listening. Ask me to help with gear specs, rental dates, or cinematic tips.</p>
        </div>
      )}
    </div>
  );
};

export default LiveAssistant;
