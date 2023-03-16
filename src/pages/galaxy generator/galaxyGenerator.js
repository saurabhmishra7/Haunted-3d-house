import React, { Component, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";


export default function GalaxyGenerator() {
  const mountRef = useRef(null);
    useEffect(()=>{
      /**
       * Base
       */
      // Debug

      const { current } = mountRef;
      if (!current) {
        return;
      }

      
      // Canvas
      const canvas = document.querySelector("canvas.webgl");

      // Scene
      const scene = new THREE.Scene();

      /**
       * Generate Galaxy 
       */
      const parameter = {
      };
      parameter.size = 0.02;
      parameter.count = 2000;
      parameter.branch = 3;
      parameter.radius = 5;
      parameter.spin = 1;
      parameter.randomness = 0.2
      parameter.randomnessPower = 3
      parameter.insideColor = '#ff6030'
      parameter.outsideColor = '#1b3984' 
      let galaxyGeometery = null;
      let material = null;
      let galaxy = null;
      const generateGalaxy = ()=>{

        /**
         * Destroy Previous Galaxy 
         */
        if(galaxy !== null) {
          galaxyGeometery.dispose();
          material.dispose();
          scene.remove(galaxy);
        }

         galaxyGeometery = new THREE.BufferGeometry();
        const positions = new Float32Array(parameter.count*3);
        const colorInside = new THREE.Color(parameter.insideColor)
        const colorOutside = new THREE.Color(parameter.outsideColor)
        const colors = new Float32Array(parameter.count * 3);

        for(let i = 0; i<parameter.count; ++i){
          const i3 = i*3;
          const branchRadius = (Math.random()*parameter.radius);
          const spinAngle = branchRadius*parameter.spin;
          const branchAngle = ((i % parameter.branch)/(parameter.branch)) * Math.PI*2;
          //Adding spreadness on galaxyParticle
          const randomX = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * branchRadius
          const randomY = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * branchRadius
          const randomZ = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameter.randomness * branchRadius
          positions[i3] = Math.cos(branchAngle + spinAngle)*branchRadius + randomX ;
          positions[i3 + 1] = randomY;
          positions[i3 + 2] = (Math.sin(branchAngle + spinAngle)*branchRadius) + randomZ;

          // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, branchRadius / parameter.radius)
        
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
        } 
        galaxyGeometery.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        galaxyGeometery.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        material = new THREE.PointsMaterial({
          size: parameter.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true
        })
        galaxy = new THREE.Points(galaxyGeometery, material);
        scene.add(galaxy);
      }
      generateGalaxy();

      /**
    *Adding Tweaks 
    */
    const gui = new dat.GUI();
    gui.add(parameter , 'count' ).max(1000000).min(100).step(100).onFinishChange(generateGalaxy);
    gui.add(parameter, 'size').min(0.001).max(0.1).step(0.01).onFinishChange(generateGalaxy);
    gui.add(parameter, 'branch').min(1).max(100).step(1).onFinishChange(generateGalaxy);
    gui.add(parameter, 'radius').min(1).max(100).step(1).onFinishChange(generateGalaxy);
    gui.add(parameter, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
    gui.add(parameter, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
    gui.add(parameter, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
    gui.addColor(parameter, 'insideColor').onFinishChange(generateGalaxy)
    gui.addColor(parameter, 'outsideColor').onFinishChange(generateGalaxy)


      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

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
      camera.position.x = 3;
      camera.position.y = 3;
      camera.position.z = 3;
      scene.add(camera);

      
      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer();
      const {domElement} = renderer;
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

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();

    return () => {
      current.removeChild(domElement);
    };
    }, [])
  return (
    <div ref={mountRef}>
      
    </div>
  )
}
