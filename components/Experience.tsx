import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';

interface ExperienceProps {
  isMagicActive: boolean;
  isAssembled: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ isMagicActive, isAssembled }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, toneMappingExposure: 1.1 }}
      shadows
    >
      <PerspectiveCamera makeDefault position={[0, 2, 14]} fov={45} />
      
      <OrbitControls 
        autoRotate={isAssembled}
        autoRotateSpeed={0.5}
        enablePan={false} 
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={8}
        maxDistance={25}
        enableZoom={true}
      />

      <ambientLight intensity={0.2} color="#111111" />
      
      {/* Key Light (Moon/Studio) */}
      <spotLight 
        position={[5, 10, 5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color="#ffffff" 
        castShadow 
        shadow-bias={-0.0001}
      />

      {/* Warm Fill Light (Gold glow from bottom) */}
      <pointLight position={[-4, -4, 4]} intensity={1.5} color="#ffaa00" />
      
      {/* Rim Light (Neutral/Warm to let Red pop, previously green) */}
      <spotLight position={[0, 5, -10]} intensity={4} color="#ffdcb4" distance={20} />

      <Environment preset="city" blur={0.8} background={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group position={[0, 0, 0]}>
        <ChristmasTree isMagicActive={isMagicActive} isAssembled={isAssembled} />
      </group>

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.9} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.6}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience;