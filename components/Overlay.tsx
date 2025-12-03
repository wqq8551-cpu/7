import React from 'react';
import { Sparkles, RefreshCcw, BoxSelect } from 'lucide-react';

interface OverlayProps {
  onAction: () => void;
  onReset: () => void;
  isAssembled: boolean;
  isMagicActive: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ onAction, onReset, isAssembled, isMagicActive }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none">
      {/* Header */}
      <header className="flex flex-col items-center md:items-start animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-lg tracking-wider">
          GIFT
        </h1>
        <p className="text-emerald-200/60 font-sans tracking-[0.3em] text-xs md:text-sm mt-2 uppercase">
          Signature Holiday Collection
        </p>
      </header>

      {/* Center Action (Empty primarily to show the tree) */}
      <div className="flex-grow"></div>

      {/* Footer Controls */}
      <footer className="flex flex-col items-center pb-8 space-y-6 pointer-events-auto">
        <div className={`transition-all duration-1000 ${isMagicActive ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
          <p className="font-serif text-yellow-100/80 text-lg italic text-center mb-4 text-shadow-glow">
            {isAssembled 
              ? "Ignite the golden hour." 
              : "Chaos to couture. Experience the assembly."}
          </p>
        </div>

        <div className="flex gap-4">
          {/* Main Action Button */}
          <button
            onClick={onAction}
            disabled={isMagicActive}
            className={`
              group relative px-10 py-4 
              bg-emerald-950/80 backdrop-blur-sm 
              border border-yellow-500/30 rounded-full 
              transition-all duration-700 ease-out
              hover:bg-emerald-900 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMagicActive ? 'scale-95 border-yellow-300 shadow-[0_0_50px_rgba(255,215,0,0.6)]' : 'scale-100'}
            `}
          >
            <div className="flex items-center space-x-3">
              <Sparkles 
                className={`w-5 h-5 text-yellow-300 transition-transform duration-700 ${isMagicActive ? 'rotate-180 scale-125' : 'group-hover:rotate-45'}`} 
              />
              <span className="font-sans font-bold text-yellow-100 tracking-widest text-sm uppercase min-w-[120px] text-center">
                {isAssembled 
                   ? (isMagicActive ? 'Radiating...' : 'Ignite Magic')
                   : 'Assemble Tree'
                }
              </span>
            </div>
            
            {/* Button inner glow border */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 group-hover:ring-yellow-200/20 transition-all"></div>
          </button>

          {/* Reset Button (Only visible if assembled) */}
          <button
             onClick={onReset}
             className={`
                px-4 py-4
                bg-emerald-950/40 backdrop-blur-sm
                border border-emerald-500/20 rounded-full
                text-emerald-400/60 hover:text-emerald-200 hover:border-emerald-500/50 hover:bg-emerald-900/60
                transition-all duration-500
                ${isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
             `}
             aria-label="Reset Experience"
          >
            <RefreshCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-180" />
          </button>
        </div>
        
        <div className="text-emerald-800/40 text-[10px] font-sans tracking-widest uppercase mt-4">
          © 2024 Gift Interaction Design
        </div>
      </footer>
    </div>
  );
};

export default Overlay;