import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface ChristmasTreeProps {
  isMagicActive: boolean;
  isAssembled: boolean;
}

// --- CONSTANTS & MATERIALS ---

// Significantly increased counts for a lush, verdant look
const COUNT_FOLIAGE_DARK = 2400;
const COUNT_FOLIAGE_LIGHT = 1000;
const COUNT_ORNAMENTS_GOLD = 80;
const COUNT_ORNAMENTS_RED = 80;

const emeraldMaterial = new THREE.MeshStandardMaterial({
  color: "#004d25", // Deep, rich green
  roughness: 0.2,
  metalness: 0.4,
  flatShading: true,
});

const freshGreenMaterial = new THREE.MeshStandardMaterial({
  color: "#2e8b57", // Lighter, fresh pine green for tips/vitality
  roughness: 0.3,
  metalness: 0.2,
  flatShading: true,
});

const goldMaterial = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  roughness: 0.1,
  metalness: 1.0,
  emissive: "#aa8800",
  emissiveIntensity: 0.1,
});

const redMaterial = new THREE.MeshStandardMaterial({
  color: "#D40000", // Deep Christmas Red
  roughness: 0.15,
  metalness: 0.7,
  emissive: "#550000",
  emissiveIntensity: 0.2,
});

// --- HELPER FUNCTIONS ---

const randomSpherePoint = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// --- SUB-COMPONENTS ---

const TreeSystem: React.FC<{ isAssembled: boolean; isMagicActive: boolean }> = ({ isAssembled, isMagicActive }) => {
  const foliageDarkRef = useRef<THREE.InstancedMesh>(null);
  const foliageLightRef = useRef<THREE.InstancedMesh>(null);
  const goldMeshRef = useRef<THREE.InstancedMesh>(null);
  const redMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // --- DATA GENERATION ---

  const { foliageDarkData, foliageLightData, goldData, redData } = useMemo(() => {
    
    // Helper to generate foliage data
    const generateFoliage = (count: number, scaleMultiplier: number = 1) => {
      const data = [];
      const treeHeight = 9;
      const maxRadius = 4.2; // Slightly wider for lush look

      for (let i = 0; i < count; i++) {
        const yNorm = 1 - Math.pow(Math.random(), 1.5);
        const y = yNorm * treeHeight;
        const radiusAtHeight = maxRadius * (1 - y / (treeHeight + 0.5));
        
        // Push some particles slightly outward for fluffiness
        const rVariance = Math.random() * 0.5; 
        const r = (Math.sqrt(Math.random()) * radiusAtHeight) + (rVariance * 0.2); 
        
        const theta = Math.random() * Math.PI * 2;
        
        const treePos = new THREE.Vector3(
          r * Math.cos(theta),
          y - 4, // Center vertically
          r * Math.sin(theta)
        );

        const scatterPos = randomSpherePoint(20); // Larger scatter radius
        
        const lookAtTarget = new THREE.Vector3(treePos.x * 2, treePos.y, treePos.z * 2);
        dummy.position.copy(treePos);
        dummy.lookAt(lookAtTarget);
        dummy.rotateX(Math.random() * 0.5);
        const treeRot = dummy.rotation.clone();
        const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0);

        const scale = (0.12 + Math.random() * 0.18) * scaleMultiplier;

        data.push({ treePos, scatterPos, treeRot, scatterRot, scale });
      }
      return data;
    };

    const fDarkData = generateFoliage(COUNT_FOLIAGE_DARK, 1.0);
    // Light foliage slightly smaller but pushed out more by randomness logic implies tips
    const fLightData = generateFoliage(COUNT_FOLIAGE_LIGHT, 0.9);

    // Ornament Data Helper
    const generateOrnaments = (count: number) => {
      const data = [];
      const treeHeight = 9;
      const maxRadius = 4;
      for (let i = 0; i < count; i++) {
        const yRaw = Math.random(); 
        const y = yRaw * (treeHeight - 1);
        const radiusAtHeight = (maxRadius * (1 - y / treeHeight)) + 0.2; 
        const theta = Math.random() * Math.PI * 2;

        const treePos = new THREE.Vector3(
          radiusAtHeight * Math.cos(theta),
          y - 4, 
          radiusAtHeight * Math.sin(theta)
        );

        const scatterPos = randomSpherePoint(15);
        const scale = 0.15 + Math.random() * 0.15;
        data.push({ treePos, scatterPos, scale });
      }
      return data;
    };

    const gData = generateOrnaments(COUNT_ORNAMENTS_GOLD);
    const rData = generateOrnaments(COUNT_ORNAMENTS_RED);

    return { foliageDarkData: fDarkData, foliageLightData: fLightData, goldData: gData, redData: rData };
  }, [dummy]);

  // --- ANIMATION LOOP ---
  
  const progress = useRef(0);

  useFrame((state, delta) => {
    // 1. Update Progress
    const target = isAssembled ? 1 : 0;
    progress.current = THREE.MathUtils.damp(progress.current, target, 2.5, delta);
    
    const t = state.clock.getElapsedTime();
    const p = progress.current;
    const ease = p * p * (3 - 2 * p); 

    // Helper for simple position/scale lerping
    const updateMesh = (ref: React.RefObject<THREE.InstancedMesh>, data: any[], isFoliage: boolean) => {
        if (!ref.current) return;

        data.forEach((d, i) => {
            const pos = new THREE.Vector3().lerpVectors(d.scatterPos, d.treePos, ease);

            // Spiral Effect
            const spiralStrength = Math.sin(p * Math.PI) * (isFoliage ? 5 : 3); 
            if (spiralStrength > 0.01) {
                const angle = spiralStrength * (1.0 - ((d.treePos.y + 4) / 9));
                const x = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
                const z = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);
                pos.x = x;
                pos.z = z;
            }

            // Floating Noise
            if (p > 0.9) {
                pos.y += Math.sin(t * (isFoliage ? 1 : 2) + i) * 0.03;
            } else {
                pos.y += Math.sin(t * 0.5 + i) * 0.05;
                pos.x += Math.cos(t * 0.3 + i) * 0.02;
            }

            dummy.position.copy(pos);

            // Rotation
            if (isFoliage) {
                const qScatter = new THREE.Quaternion().setFromEuler(d.scatterRot);
                const qTree = new THREE.Quaternion().setFromEuler(d.treeRot);
                if (p < 0.2) qScatter.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), t * 0.2));
                dummy.quaternion.slerpQuaternions(qScatter, qTree, ease);
            } else {
                dummy.rotation.set(0, t + i, 0);
            }
            
            // Scale
            const baseScale = d.scale;
            // Ornaments shrink to 0 when scattered, Foliage stays visible but small
            const scaleMultiplier = isFoliage ? (0.5 + 0.5 * p) : p; 
            dummy.scale.setScalar(baseScale * scaleMultiplier); 

            dummy.updateMatrix();
            ref.current!.setMatrixAt(i, dummy.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    };

    updateMesh(foliageDarkRef, foliageDarkData, true);
    updateMesh(foliageLightRef, foliageLightData, true);
    updateMesh(goldMeshRef, goldData, false);
    updateMesh(redMeshRef, redData, false);
  });

  return (
    <group>
      {/* Dark Foliage Base */}
      <instancedMesh
        ref={foliageDarkRef}
        args={[undefined, undefined, COUNT_FOLIAGE_DARK]}
        castShadow
        receiveShadow
        material={emeraldMaterial}
      >
        <tetrahedronGeometry args={[1, 0]} />
      </instancedMesh>

      {/* Light Foliage Highlights */}
      <instancedMesh
        ref={foliageLightRef}
        args={[undefined, undefined, COUNT_FOLIAGE_LIGHT]}
        castShadow
        receiveShadow
        material={freshGreenMaterial}
      >
        <tetrahedronGeometry args={[1, 0]} />
      </instancedMesh>

      {/* Gold Ornaments */}
      <instancedMesh
        ref={goldMeshRef}
        args={[undefined, undefined, COUNT_ORNAMENTS_GOLD]}
        castShadow
        receiveShadow
        material={goldMaterial}
      >
        <sphereGeometry args={[1, 16, 16]} />
      </instancedMesh>

      {/* Red Ornaments */}
      <instancedMesh
        ref={redMeshRef}
        args={[undefined, undefined, COUNT_ORNAMENTS_RED]}
        castShadow
        receiveShadow
        material={redMaterial}
      >
        <sphereGeometry args={[1, 16, 16]} />
      </instancedMesh>
    </group>
  );
};

const Star: React.FC<{ isMagicActive: boolean; isAssembled: boolean }> = ({ isMagicActive, isAssembled }) => {
  const starRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (starRef.current) {
      const t = state.clock.getElapsedTime();
      const targetScale = isAssembled ? (isMagicActive ? 1.5 : 1.0) : 0.0;
      starRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      starRef.current.rotation.y = t * 0.5;
      starRef.current.position.y = 5 + Math.sin(t * 2) * 0.1; // Adjusted height for centered tree
    }
  });

  return (
    <group position={[0, 5, 0]} ref={starRef}>
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial 
          color="#ffffee" 
          emissive="#ffffee" 
          emissiveIntensity={isMagicActive ? 4 : 1} 
          toneMapped={false}
        />
      </mesh>
      {isAssembled && (
        <pointLight 
            intensity={isMagicActive ? 5 : 2} 
            distance={10} 
            color="#ffd700" 
            decay={2}
        />
      )}
    </group>
  );
};

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ isMagicActive, isAssembled }) => {
  return (
    <group>
      <Float 
        speed={isAssembled ? 2 : 0.5} 
        rotationIntensity={isAssembled ? 0.1 : 0.5} 
        floatIntensity={isAssembled ? 0.2 : 1.0}
        floatingRange={isAssembled ? [-0.1, 0.1] : [-2, 2]}
      >
        <TreeSystem isAssembled={isAssembled} isMagicActive={isMagicActive} />
        <Star isAssembled={isAssembled} isMagicActive={isMagicActive} />

        <Sparkles 
          count={isMagicActive && isAssembled ? 300 : 0} 
          scale={8} 
          size={6} 
          speed={2} 
          opacity={isMagicActive ? 1 : 0}
          color="#FFD700"
          position={[0, 0, 0]}
        />
      </Float>
    </group>
  );
};

export default ChristmasTree;