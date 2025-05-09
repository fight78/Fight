import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Box(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function ShooterGame() {
  const bullets = useRef([]);
  const [targets, setTargets] = useState([
    { position: [5, 0, 0], health: 100 },
    { position: [-5, 0, 0], health: 100 },
  ]);

  const shoot = () => {
    const bullet = {
      position: [0, 0, 0],
      velocity: [0, 0, -0.2],
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 'yellow' })
      ),
    };
    bullets.current.push(bullet);
  };

  useFrame(() => {
    bullets.current.forEach((bullet, index) => {
      bullet.position[0] += bullet.velocity[0];
      bullet.position[1] += bullet.velocity[1];
      bullet.position[2] += bullet.velocity[2];
      bullet.mesh.position.set(...bullet.position);

      // Check collision with targets
      targets.forEach((target, tIndex) => {
        const distance = Math.sqrt(
          Math.pow(bullet.position[0] - target.position[0], 2) +
          Math.pow(bullet.position[1] - target.position[1], 2) +
          Math.pow(bullet.position[2] - target.position[2], 2)
        );
        if (distance < 1) {
          // Hit target
          const newTargets = [...targets];
          newTargets[tIndex].health -= 25;
          if (newTargets[tIndex].health <= 0) {
            newTargets.splice(tIndex, 1);
          }
          setTargets(newTargets);
          bullets.current.splice(index, 1);
        }
      });
    });
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[0, 0, 0]} />
      <Stars />
      <OrbitControls />
      {targets.map((target, index) => (
        <mesh key={index} position={target.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
      <primitive object={new THREE.AxesHelper(10)} />
    </Canvas>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ShooterGame />
      <button 
        style={{ position: 'absolute', top: '20px', left: '20px' }}
        onClick={() => window.location.reload()}
      >
        Shoot
      </button>
    </div>
  );
}