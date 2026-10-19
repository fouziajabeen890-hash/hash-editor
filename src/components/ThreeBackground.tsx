import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Primary Cyan Particle Field (Data nodes)
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 35;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Secondary Indigo Particle Field
    const particleCount2 = 150;
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(particleCount2 * 3);
    for (let i = 0; i < particleCount2 * 3; i += 3) {
      pos2[i] = (Math.random() - 0.5) * 60;
      pos2[i + 1] = (Math.random() - 0.5) * 60;
      pos2[i + 2] = (Math.random() - 0.5) * 45;
    }
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const mat2 = new THREE.PointsMaterial({
      size: 0.3,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles2 = new THREE.Points(geo2, mat2);
    scene.add(particles2);

    // 3. Floating 3D Wireframe Rings (Cybernetic rings)
    const ringGroup = new THREE.Group();
    
    const torusGeo1 = new THREE.TorusGeometry(10, 0.05, 16, 100);
    const torusMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25, wireframe: true });
    const ring1 = new THREE.Mesh(torusGeo1, torusMat1);
    ringGroup.add(ring1);

    const torusGeo2 = new THREE.TorusGeometry(14, 0.05, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.2, wireframe: true });
    const ring2 = new THREE.Mesh(torusGeo2, torusMat2);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring2);

    const torusGeo3 = new THREE.TorusGeometry(18, 0.05, 16, 100);
    const torusMat3 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15, wireframe: true });
    const ring3 = new THREE.Mesh(torusGeo3, torusMat3);
    ring3.rotation.y = Math.PI / 4;
    ringGroup.add(ring3);

    scene.add(ringGroup);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 6;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      particles2.rotation.y -= 0.0015;
      particles2.rotation.z += 0.001;

      ringGroup.rotation.x += 0.003;
      ringGroup.rotation.y += 0.004;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      geo2.dispose();
      mat2.dispose();
      torusGeo1.dispose();
      torusMat1.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      torusGeo3.dispose();
      torusMat3.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75"
    />
  );
}
