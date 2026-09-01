import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Canvas3DSceneProps {
  scrollProgress: number; // 0 to 1
  degradedScenario?: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals';
  activeTicker?: string;
  isAnalyzing?: boolean;
  currentStock?: any;
}

export const Canvas3DScene: React.FC<Canvas3DSceneProps> = ({
  scrollProgress,
  degradedScenario = 'none',
  isAnalyzing = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    scrollProgress: 0,
    targetProgress: 0,
    scrollVelocity: 0,
    lastScrollY: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    degradedScenario,
    isAnalyzing,
    cameraPanX: 0,
    targetCameraPanX: 0,
  });

  // Keep state updated
  useEffect(() => {
    const delta = scrollProgress - stateRef.current.targetProgress;
    stateRef.current.scrollVelocity = delta * 60; // velocity impulse
    stateRef.current.targetProgress = scrollProgress;
    stateRef.current.degradedScenario = degradedScenario;
    stateRef.current.isAnalyzing = isAnalyzing;
    
    // When scrolling down (progress increasing), pan starfield to the RIGHT (camera moves left or field shifts right)
    // When scrolling up (progress decreasing), pan starfield to the LEFT
    stateRef.current.targetCameraPanX = scrollProgress * 12.0;
  }, [scrollProgress, degradedScenario, isAnalyzing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ============================================================================
    // 2. MULTI-LAYER STARFIELD WITH PARALLAX PANNING TO THE RIGHT ON DOWN-SCROLL
    // ============================================================================
    const starfieldMasterGroup = new THREE.Group();
    scene.add(starfieldMasterGroup);

    // Layer A: Deep Background Stellar Field (1,800 stars)
    const deepStarCount = 1800;
    const deepGeo = new THREE.BufferGeometry();
    const deepPos = new Float32Array(deepStarCount * 3);
    const deepColors = new Float32Array(deepStarCount * 3);
    const deepSizes = new Float32Array(deepStarCount);

    const colorPalette = [
      new THREE.Color(0xffffff), // Pure diamond
      new THREE.Color(0x93c5fd), // Subtle cool cyan-blue
      new THREE.Color(0xc084fc), // Celestial violet
      new THREE.Color(0xfde68a), // Stellar warm gold
      new THREE.Color(0x6ee7b7), // Emerald highlight
    ];

    for (let i = 0; i < deepStarCount; i++) {
      const idx = i * 3;
      // Wide horizontal spread for continuous dynamic panning
      deepPos[idx] = (Math.random() - 0.5) * 80;
      deepPos[idx + 1] = (Math.random() - 0.5) * 45;
      deepPos[idx + 2] = -15 - Math.random() * 65;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      deepColors[idx] = col.r;
      deepColors[idx + 1] = col.g;
      deepColors[idx + 2] = col.b;
      deepSizes[i] = Math.random() * 0.08 + 0.03;
    }

    deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPos, 3));
    deepGeo.setAttribute('color', new THREE.BufferAttribute(deepColors, 3));

    const deepMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const deepStarPoints = new THREE.Points(deepGeo, deepMat);
    starfieldMasterGroup.add(deepStarPoints);

    // Layer B: Mid-ground Volumetric Dust & Nebula Clusters
    const nebulaCount = 450;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const idx = i * 3;
      nebulaPos[idx] = (Math.random() - 0.5) * 50;
      nebulaPos[idx + 1] = (Math.random() - 0.5) * 30;
      nebulaPos[idx + 2] = -5 - Math.random() * 30;

      const rnd = Math.random();
      const col = rnd < 0.4 ? new THREE.Color(0x06b6d4) : rnd < 0.8 ? new THREE.Color(0x8b5cf6) : new THREE.Color(0x10b981);
      nebulaColors[idx] = col.r * 0.7;
      nebulaColors[idx + 1] = col.g * 0.7;
      nebulaColors[idx + 2] = col.b * 0.7;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    starfieldMasterGroup.add(nebulaPoints);

    // Layer C: High-Speed Kinetic Streak Particles (react to scroll velocity)
    const streakCount = 120;
    const streakGeo = new THREE.BufferGeometry();
    const streakPos = new Float32Array(streakCount * 6); // 2 vertices per line
    const streakMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < streakCount; i++) {
      const idx = i * 6;
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 15;
      
      streakPos[idx] = x;
      streakPos[idx + 1] = y;
      streakPos[idx + 2] = z;

      streakPos[idx + 3] = x + 0.4;
      streakPos[idx + 4] = y;
      streakPos[idx + 5] = z;
    }
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
    const streakLines = new THREE.LineSegments(streakGeo, streakMat);
    starfieldMasterGroup.add(streakLines);

    // ============================================================================
    // 3. THREE PHYSICAL GLOWING 3D ROBOT DETECTIVES (ENTITIES)
    // ============================================================================
    const swarmCluster = new THREE.Group();
    scene.add(swarmCluster);

    // Helper: Create Robot Entity
    const createRobotEntity = (colorHex: number, accentHex: number) => {
      const group = new THREE.Group();

      // Inner Core
      const coreGeo = new THREE.OctahedronGeometry(0.24, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // Outer Orbital Ring 1
      const ring1Geo = new THREE.TorusGeometry(0.42, 0.015, 16, 48);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: accentHex,
        transparent: true,
        opacity: 0.8,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      group.add(ring1);

      // Outer Orbital Ring 2 (Orthogonal)
      const ring2Geo = new THREE.TorusGeometry(0.52, 0.012, 16, 48);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      group.add(ring2);

      // Pulse Halo
      const haloGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);

      return { group, coreMesh, ring1, ring2, halo };
    };

    // Robot 1: Chart Detective (Cyan)
    const robot1 = createRobotEntity(0x06b6d4, 0x38bdf8);
    swarmCluster.add(robot1.group);

    // Robot 2: Rulebook Detective (Emerald)
    const robot2 = createRobotEntity(0x10b981, 0x34d399);
    swarmCluster.add(robot2.group);

    // Robot 3: News Detective (Violet)
    const robot3 = createRobotEntity(0x8b5cf6, 0xa78bfa);
    swarmCluster.add(robot3.group);

    const robots = [robot1, robot2, robot3];

    // Constellation Interconnection Laser Mesh
    const constellationGeo = new THREE.BufferGeometry();
    const constellationPos = new Float32Array(9 * 2); // 3 edges between robots
    constellationGeo.setAttribute('position', new THREE.BufferAttribute(constellationPos, 3));
    const constellationMat = new THREE.LineBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
    swarmCluster.add(constellationLines);

    // ============================================================================
    // 4. SCENE 3: VOLUMETRIC HOLOGRAPHIC CHART GRID & DATA STREAM
    // ============================================================================
    const holoChartGroup = new THREE.Group();
    scene.add(holoChartGroup);

    // Coordinate Grid Planes
    const grid1 = new THREE.GridHelper(6, 12, 0x06b6d4, 0x1e293b);
    grid1.position.y = -1.2;
    grid1.rotation.x = 0.2;
    holoChartGroup.add(grid1);

    // Volumetric Glowing Sine Wave Ribbon
    const wavePointsCount = 50;
    const waveGeo = new THREE.BufferGeometry();
    const wavePositions = new Float32Array(wavePointsCount * 3);
    const waveColors = new Float32Array(wavePointsCount * 3);

    for (let i = 0; i < wavePointsCount; i++) {
      const u = (i / (wavePointsCount - 1)) * 4 - 2;
      const v = Math.sin(u * 2.5) * 0.4 + Math.cos(u * 1.5) * 0.2;
      wavePositions[i * 3] = u;
      wavePositions[i * 3 + 1] = v;
      wavePositions[i * 3 + 2] = 0;

      const col = i > 30 ? new THREE.Color(0x10b981) : new THREE.Color(0x06b6d4);
      waveColors[i * 3] = col.r;
      waveColors[i * 3 + 1] = col.g;
      waveColors[i * 3 + 2] = col.b;
    }
    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const waveMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    const waveLine = new THREE.Line(waveGeo, waveMat);
    holoChartGroup.add(waveLine);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 20);
    pointLight1.position.set(3, 2, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 20);
    pointLight2.position.set(-3, -2, 4);
    scene.add(pointLight2);

    // ============================================================================
    // 5. MOUSE & SCROLL KINETIC TRACKING
    // ============================================================================
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.8;
      stateRef.current.targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 1.8;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ============================================================================
    // 6. 60FPS HIGH-PERFORMANCE RENDER LOOP
    // ============================================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for scroll progress & camera panning
      stateRef.current.scrollProgress +=
        (stateRef.current.targetProgress - stateRef.current.scrollProgress) * 0.08;
      stateRef.current.cameraPanX +=
        (stateRef.current.targetCameraPanX - stateRef.current.cameraPanX) * 0.08;
      stateRef.current.mouseX +=
        (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.05;
      stateRef.current.mouseY +=
        (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.05;

      const p = stateRef.current.scrollProgress;
      const panX = stateRef.current.cameraPanX;
      const mx = stateRef.current.mouseX;
      const my = stateRef.current.mouseY;

      // ============================================================================
      // PARALLAX SHIFT: Starfield pan strictly to the RIGHT on downward scroll
      // ============================================================================
      // As user scrolls down (p increases), starfield moves to the right (+X)
      // Different depth layers move at different parallax step ratios:
      deepStarPoints.position.x = panX * 0.4 + Math.sin(elapsedTime * 0.05) * 0.5;
      nebulaPoints.position.x = panX * 0.7 + Math.sin(elapsedTime * 0.08) * 0.3;
      streakLines.position.x = (panX * 1.2) % 30;

      // Subtle vertical depth sway
      deepStarPoints.position.y = Math.cos(elapsedTime * 0.05) * 0.3;
      nebulaPoints.position.y = Math.sin(elapsedTime * 0.07) * 0.2;

      // Degraded Mode Glitch Effect
      if (stateRef.current.degradedScenario !== 'none') {
        const glitchAmount = (Math.random() - 0.5) * 0.15;
        camera.position.x += glitchAmount;
        camera.position.y += glitchAmount * 0.5;
      }

      // ============================================================================
      // SCENE-BASED TRANSFORMATIONS ACROSS THE 5 SCROLL PHASES
      // ============================================================================

      // Orbit math for the 3 Robot Entities
      const basePositions = [
        new THREE.Vector3(-1.8, 0.4, 0),  // Robot 1 (Chart - Left)
        new THREE.Vector3(0, 0.8, 0.2),   // Robot 2 (Rulebook - Center)
        new THREE.Vector3(1.8, 0.4, 0),   // Robot 3 (News - Right)
      ];

      // Phase 1: Swarm Active (0.0 to 0.20)
      // Phase 2: Data Convergence (0.20 to 0.40)
      // Phase 3: Deep Market Analysis / Chart Detective Focus (0.40 to 0.65)
      // Phase 4: External Context & Swarm Matrix (0.65 to 0.85)
      // Phase 5: Action & Portfolio Synthesis (0.85 to 1.00)

      const robotPositions: THREE.Vector3[] = [];

      robots.forEach((robot, i) => {
        // Continuous organic floating & ring rotation
        robot.ring1.rotation.x = elapsedTime * (0.8 + i * 0.2);
        robot.ring1.rotation.y = elapsedTime * (0.5 + i * 0.15);
        robot.ring2.rotation.y = elapsedTime * (0.6 - i * 0.2);
        robot.ring2.rotation.z = elapsedTime * (0.4 + i * 0.1);
        robot.coreMesh.rotation.y = elapsedTime * (1.2 + i * 0.3);

        const floatY = Math.sin(elapsedTime * 1.5 + i * 2) * 0.12;

        let targetPos = new THREE.Vector3();

        if (p < 0.25) {
          // Scene 1: Floating Trio Formation
          targetPos.copy(basePositions[i]);
          targetPos.y += floatY;
          targetPos.x += mx * 0.4;
          targetPos.y += my * 0.3;
          swarmCluster.position.z = 0;
          swarmCluster.visible = true;
        } else if (p >= 0.25 && p < 0.45) {
          // Scene 2: Converging towards center data stream
          const t = (p - 0.25) / 0.20;
          const convergeX = basePositions[i].x * (1 - t * 0.6);
          const convergeY = basePositions[i].y * (1 - t * 0.3) + floatY;
          targetPos.set(convergeX + mx * 0.3, convergeY + my * 0.2, -t * 2);
          swarmCluster.visible = true;
        } else if (p >= 0.45 && p < 0.70) {
          // Scene 3: Chart Detective (Robot 1) projects forward, others orbit background
          if (i === 0) {
            // Chart Detective steps forward to stage center
            targetPos.set(mx * 0.3, 0.2 + floatY + my * 0.2, 1.2);
            robot.group.scale.setScalar(1.3);
          } else {
            // Others flank softly in background
            targetPos.set(basePositions[i].x * 1.4, basePositions[i].y - 0.6 + floatY, -2.5);
            robot.group.scale.setScalar(0.7);
          }
          swarmCluster.visible = true;
        } else if (p >= 0.70 && p < 0.88) {
          // Scene 4: Swarm Data Columns & Radar projection
          targetPos.set(basePositions[i].x * 1.2 + mx * 0.2, -0.4 + floatY, -1.0);
          robot.group.scale.setScalar(0.9);
          swarmCluster.visible = true;
        } else {
          // Scene 5: Synthesizer Core Convergence
          const t = (p - 0.88) / 0.12;
          const angle = (i * Math.PI * 2) / 3 + elapsedTime * 0.6;
          const radius = 1.0 * (1 - t * 0.5);
          targetPos.set(Math.cos(angle) * radius, Math.sin(angle) * radius + 0.2, -t * 1.5);
          robot.group.scale.setScalar(0.85);
          swarmCluster.visible = true;
        }

        robot.group.position.lerp(targetPos, 0.1);
        robotPositions.push(robot.group.position);
      });

      // Update Constellation Lines connecting robots
      if (robotPositions.length === 3) {
        const posAttr = constellationGeo.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        // Line 0: Robot 0 -> Robot 1
        arr[0] = robotPositions[0].x; arr[1] = robotPositions[0].y; arr[2] = robotPositions[0].z;
        arr[3] = robotPositions[1].x; arr[4] = robotPositions[1].y; arr[5] = robotPositions[1].z;

        // Line 1: Robot 1 -> Robot 2
        arr[6] = robotPositions[1].x; arr[7] = robotPositions[1].y; arr[8] = robotPositions[1].z;
        arr[9] = robotPositions[2].x; arr[10] = robotPositions[2].y; arr[11] = robotPositions[2].z;

        // Line 2: Robot 2 -> Robot 0
        arr[12] = robotPositions[2].x; arr[13] = robotPositions[2].y; arr[14] = robotPositions[2].z;
        arr[15] = robotPositions[0].x; arr[16] = robotPositions[0].y; arr[17] = robotPositions[0].z;

        posAttr.needsUpdate = true;
      }

      // Holographic Chart Wave Update in Scene 3
      const waveArr = waveGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < wavePointsCount; i++) {
        const u = (i / (wavePointsCount - 1)) * 4 - 2;
        waveArr[i * 3 + 1] = Math.sin(u * 3 + elapsedTime * 2) * 0.35 + Math.cos(u * 1.5 + elapsedTime) * 0.15;
      }
      waveGeo.attributes.position.needsUpdate = true;

      // Holographic Chart visibility in Scene 3 (0.40 - 0.70)
      const holoVisibility = THREE.MathUtils.clamp(1.0 - Math.abs(p - 0.55) / 0.18, 0, 1);
      holoChartGroup.visible = holoVisibility > 0.02;
      holoChartGroup.position.set(mx * 0.2, -0.6 + my * 0.1, -(p - 0.55) * 3);

      // Camera kinetic tilt and subtle orbital drift
      camera.position.x = panX * -0.15 + mx * 0.3;
      camera.position.y = my * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
