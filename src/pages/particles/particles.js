import React, { Component, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Particles() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ***
    const { current } = mountRef;
    if (!current) {
      return;
    }
    // === THREE.JS CODE START ===
    
    // Scene
    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load("/textures/particles/2.png");

    /**
     * Particles
     */
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 50000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    /* particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
 */
    // Material
    const particlesMaterial = new THREE.PointsMaterial();

    particlesMaterial.size = 0.1;
    particlesMaterial.sizeAttenuation = true;
    //particlesMaterial.color = new THREE.Color("#ff88cc");
    particlesMaterial.transparent = true;
    particlesMaterial.vertexColors = true;
    particlesMaterial.alphaMap = particleTexture;
    particlesMaterial.alphaTest = 0.001
    //particlesMaterial.depthTest = false
     particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending;

    /*particlesMaterial.vertexColors = true;
 */
    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

   /*  window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }); */

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);

 

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer();
    var { domElement } = renderer;
    current.appendChild(domElement);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();


      //Particle Movement 
      for(let i=0; i<count; ++i) {
        const ix = i*3;
        const x = particlesGeometry.attributes.position.array[ix];
        particlesGeometry.attributes.position.array[ix + 1] = Math.sin(elapsedTime + x);
      }

      // Update particle
      particlesGeometry.attributes.position.needsUpdate = true;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    // === THREE.JS CODE END ===
    // ***
    return () => {
      current.removeChild(domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}
