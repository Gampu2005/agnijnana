import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Metrology3DBackground.css';

/**
 * Metrology3DBackground:
 * Ultra-high-performance, ambient 3D inspection gantry background.
 * Procedurally generates:
 * 1. Monoblock Alloy Wheel Rim (dark titanium PBR)
 * 2. Low-profile Tyre Tread with radial grooves
 * 3. Sweeping Laser CMM Scanning Line & Pulsing Ring
 * 4. 3D Holographic Reticle Coordinate Markers
 * 5. Deep Infinite Perspective Floor Grid with Distance Fog
 * 6. Ambient Optical Telemetry Floating Particles
 *
 * Sits at z-index: 0 behind the application.
 * Fully transparent to pointer events, zero collision with the 3D entry intro.
 */
export default function Metrology3DBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // ── 1. Scene & Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(2.8, 1.4, 7.2);
    camera.lookAt(1.2, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── 2. Industrial Lighting ──────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
    scene.add(ambientLight);

    // Main Rim Light (Cyan Metrology Laser)
    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    cyanRimLight.position.set(-5, 4, 3);
    scene.add(cyanRimLight);

    // Cobalt Key Light
    const cobaltLight = new THREE.DirectionalLight(0x0284c7, 2.4);
    cobaltLight.position.set(6, -2, 4);
    scene.add(cobaltLight);

    // Dynamic scanning point-light
    const scanLight = new THREE.PointLight(0x00f0ff, 2.5, 6, 2);
    scene.add(scanLight);

    // ── 3. Procedural Alloy Wheel + Tyre Assembly ───────────────────────────────
    const wheelGroup = new THREE.Group();
    // Offset slightly to the right to create an asymmetrical industrial look
    wheelGroup.position.set(1.5, 0.1, -0.4);
    wheelGroup.rotation.y = -Math.PI / 6;
    wheelGroup.rotation.x = Math.PI / 16;
    scene.add(wheelGroup);

    // Materials
    const titaniumRimMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.92,
      roughness: 0.28,
      wireframe: false,
    });

    const machinedAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.98,
      roughness: 0.18,
    });

    const rubberTyreMaterial = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.88,
      metalness: 0.12,
    });

    const wireframeHoloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    // Outer Tyre (Torus)
    const tyreGeo = new THREE.TorusGeometry(2.15, 0.48, 24, 64);
    const tyreMesh = new THREE.Mesh(tyreGeo, rubberTyreMaterial);
    wheelGroup.add(tyreMesh);

    // Outer Rim Lip Barrel
    const rimLipGeo = new THREE.CylinderGeometry(1.78, 1.78, 0.72, 48, 1, true);
    rimLipGeo.rotateX(Math.PI / 2);
    const rimLipMesh = new THREE.Mesh(rimLipGeo, titaniumRimMaterial);
    wheelGroup.add(rimLipMesh);

    // Outer Flange Ring
    const flangeGeo = new THREE.TorusGeometry(1.82, 0.08, 16, 48);
    const flangeMesh = new THREE.Mesh(flangeGeo, machinedAccentMaterial);
    wheelGroup.add(flangeMesh);

    // Inner Drop Center Hub
    const hubGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32);
    hubGeo.rotateX(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, machinedAccentMaterial);
    wheelGroup.add(hubMesh);

    // Center Spindle Bore
    const boreGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.52, 24);
    boreGeo.rotateX(Math.PI / 2);
    const boreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const boreMesh = new THREE.Mesh(boreGeo, boreMat);
    wheelGroup.add(boreMesh);

    // 5 Aerodynamic Spokes
    const spokeCount = 5;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * Math.PI * 2) / spokeCount;
      const spokeGeo = new THREE.BoxGeometry(0.22, 1.25, 0.18);
      const spokeMesh = new THREE.Mesh(spokeGeo, titaniumRimMaterial);
      spokeMesh.position.set(
        Math.cos(angle) * 1.05,
        Math.sin(angle) * 1.05,
        0.05
      );
      spokeMesh.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spokeMesh);

      // Diamond-cut machined face strip
      const stripGeo = new THREE.BoxGeometry(0.08, 1.15, 0.04);
      const stripMesh = new THREE.Mesh(stripGeo, machinedAccentMaterial);
      stripMesh.position.set(
        Math.cos(angle) * 1.05,
        Math.sin(angle) * 1.05,
        0.16
      );
      stripMesh.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(stripMesh);

      // Lug nut socket
      const lugGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.14, 12);
      lugGeo.rotateX(Math.PI / 2);
      const lugMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.3 });
      const lugMesh = new THREE.Mesh(lugGeo, lugMat);
      lugMesh.position.set(
        Math.cos(angle) * 0.38,
        Math.sin(angle) * 0.38,
        0.26
      );
      wheelGroup.add(lugMesh);
    }

    // Holographic Ghost Wireframe Wheel (Slightly larger, rotating gently)
    const holoRimGeo = new THREE.TorusGeometry(1.85, 0.12, 12, 36);
    const holoRimMesh = new THREE.Mesh(holoRimGeo, wireframeHoloMaterial);
    wheelGroup.add(holoRimMesh);

    // ── 4. Sweeping Metrology Laser Gantry ──────────────────────────────────────
    const laserGroup = new THREE.Group();
    wheelGroup.add(laserGroup);

    // Laser scanning ring
    const laserRingGeo = new THREE.RingGeometry(0.3, 2.35, 64);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const laserRingMesh = new THREE.Mesh(laserRingGeo, laserRingMat);
    laserGroup.add(laserRingMesh);

    // Bright inner laser rim
    const laserLineGeo = new THREE.TorusGeometry(2.36, 0.02, 8, 64);
    const laserLineMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const laserLineMesh = new THREE.Mesh(laserLineGeo, laserLineMat);
    laserGroup.add(laserLineMesh);

    // ── 5. Holographic Defect Coordinate Markers (Target Reticles) ─────────────
    const markerGroup = new THREE.Group();
    wheelGroup.add(markerGroup);

    const reticleGeo = new THREE.RingGeometry(0.12, 0.16, 24);
    const marker1Mat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Critical Metrology Red
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const marker1 = new THREE.Mesh(reticleGeo, marker1Mat);
    marker1.position.set(1.42, 0.65, 0.36);
    markerGroup.add(marker1);

    const marker2Mat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Warning Amber
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const marker2 = new THREE.Mesh(reticleGeo, marker2Mat);
    marker2.position.set(-0.85, 1.25, 0.34);
    markerGroup.add(marker2);

    // ── 6. Infinite Industrial Floor Grid with Distance Dissolve ───────────────
    const gridHelper = new THREE.GridHelper(36, 36, 0x00f0ff, 0x142845);
    gridHelper.position.y = -2.8;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    scene.add(gridHelper);

    // ── 7. Floating Telemetry Particles (Clean Atmospheric Dust) ───────────────
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.4) * 16;
      particlePos[i + 1] = (Math.random() - 0.4) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ── 8. Smooth Mouse Parallax Tracking ──────────────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── 9. Render Loop ─────────────────────────────────────────────────────────
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      camera.position.x = 2.8 + currentMouseX * 0.45;
      camera.position.y = 1.4 - currentMouseY * 0.35;
      camera.lookAt(1.2, 0.2, 0);

      // Continuous axial rotation of the alloy wheel specimen
      wheelGroup.rotation.z = elapsedTime * 0.12;

      // Laser scanning plane oscillates back and forth along the wheel z-axis
      const scanPos = Math.sin(elapsedTime * 1.8) * 0.42;
      laserGroup.position.z = scanPos;
      scanLight.position.set(
        wheelGroup.position.x,
        wheelGroup.position.y,
        wheelGroup.position.z + scanPos + 0.3
      );

      // Laser intensity breathing pulse
      laserRingMat.opacity = 0.22 + Math.sin(elapsedTime * 4.0) * 0.12;

      // Pulsing reticle defect markers
      const scalePulse = 1.0 + Math.sin(elapsedTime * 5.0) * 0.18;
      marker1.scale.set(scalePulse, scalePulse, 1);
      marker2.scale.set(scalePulse, scalePulse, 1);

      // Gentle floating particle drift
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // ── 10. Responsive Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // ── 11. Cleanup on Unmount ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects cleanly
      renderer.dispose();
      tyreGeo.dispose();
      rimLipGeo.dispose();
      flangeGeo.dispose();
      hubGeo.dispose();
      boreGeo.dispose();
      laserRingGeo.dispose();
      laserLineGeo.dispose();
      reticleGeo.dispose();
      gridHelper.dispose();
      particleGeo.dispose();
      titaniumRimMaterial.dispose();
      machinedAccentMaterial.dispose();
      rubberTyreMaterial.dispose();
      wireframeHoloMaterial.dispose();
      laserRingMat.dispose();
      laserLineMat.dispose();
      marker1Mat.dispose();
      marker2Mat.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="metrology-3d-bg-canvas"
      aria-hidden="true"
    />
  );
}
