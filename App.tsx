import React, { useState, useCallback, Suspense } from 'react';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [isAssembled, setIsAssembled] = useState(false);
  const [isMagicActive, setIsMagicActive] = useState(false);

  const handleToggleAssembly = useCallback(() => {
    // If not assembled, assemble it. If assembled, we can just trigger magic or disassemble.
    // Logic: 
    // 1. If Scattered -> Assemble
    // 2. If Assembled -> Toggle Magic (or Disassemble if desired, but let's keep it additive for now)
    
    if (!isAssembled) {
      setIsAssembled(true);
      // Auto ignite magic shortly after assembly starts for cinematic effect
      setTimeout(() => setIsMagicActive(true), 1500);
      setTimeout(() => setIsMagicActive(false), 6500);
    } else {
      // Re-trigger magic if already assembled
      setIsMagicActive(true);
      setTimeout(() => setIsMagicActive(false), 5000);
    }
  }, [isAssembled]);

  const handleReset = useCallback(() => {
    setIsAssembled(false);
    setIsMagicActive(false);
  }, []);

  return (
    <div className="relative w-full h-full bg-arix-dark">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-arix-gold font-serif">Loading Luxury...</div>}>
          <Experience isMagicActive={isMagicActive} isAssembled={isAssembled} />
        </Suspense>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Overlay 
          onAction={handleToggleAssembly} 
          onReset={handleReset}
          isAssembled={isAssembled}
          isMagicActive={isMagicActive} 
        />
      </div>
    </div>
  );
};

export default App;